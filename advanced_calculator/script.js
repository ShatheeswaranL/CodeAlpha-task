document.addEventListener('DOMContentLoaded', () => {
  // --- UI Elements ---
  const expressionText = document.getElementById('expressionText');
  const resultText = document.getElementById('resultText');
  const previewEquals = document.getElementById('previewEquals');
  const radDegBtn = document.getElementById('radDegBtn');
  const currentAngleMode = document.getElementById('currentAngleMode');
  const themeToggleBtn = document.getElementById('themeToggleBtn');
  const toggleHistoryBtn = document.getElementById('toggleHistoryBtn');
  const closeHistoryBtn = document.getElementById('closeHistoryBtn');
  const historyPanel = document.getElementById('historyPanel');
  const historyList = document.getElementById('historyList');
  const clearHistoryBtn = document.getElementById('clearHistoryBtn');
  const calculatorWrapper = document.querySelector('.calculator-wrapper');
  const keyboardGuide = document.getElementById('keyboardGuide');
  const closeGuideBtn = document.getElementById('closeGuideBtn');

  // --- Calculator State ---
  let expression = ''; // Internal mathematical expression
  let isRadMode = false; // Angle mode: false = DEG, true = RAD
  let history = JSON.parse(localStorage.getItem('aerocalc_history')) || [];

  // --- Initialize App ---
  initTheme();
  renderHistory();
  updateDisplay();

  // --- Event Listeners: Keypad Buttons ---
  document.querySelectorAll('.key').forEach(button => {
    button.addEventListener('click', () => {
      const value = button.getAttribute('data-value');
      const action = button.getAttribute('data-action');
      handleInput(value, action);
      // Brief haptic-like scaling active feedback handled in CSS :active
    });
  });

  // --- Event Listeners: Header Actions ---
  radDegBtn.addEventListener('click', () => {
    isRadMode = !isRadMode;
    currentAngleMode.textContent = isRadMode ? 'RAD' : 'DEG';
    radDegBtn.setAttribute('title', `Switch to ${isRadMode ? 'Degrees' : 'Radians'}`);
    updateDisplay(); // Recalculate preview in new angle mode
  });

  toggleHistoryBtn.addEventListener('click', () => {
    calculatorWrapper.classList.toggle('history-open');
  });

  closeHistoryBtn.addEventListener('click', () => {
    calculatorWrapper.classList.remove('history-open');
  });

  clearHistoryBtn.addEventListener('click', () => {
    history = [];
    localStorage.removeItem('aerocalc_history');
    renderHistory();
  });

  // Close history drawer when clicking outside it on mobile
  document.addEventListener('click', (e) => {
    if (window.innerWidth < 800) {
      const isClickInsideHistory = historyPanel.contains(e.target);
      const isClickOnToggle = toggleHistoryBtn.contains(e.target);
      if (!isClickInsideHistory && !isClickOnToggle && calculatorWrapper.classList.contains('history-open')) {
        calculatorWrapper.classList.remove('history-open');
      }
    }
  });

  // --- Keyboard Bindings ---
  document.addEventListener('keydown', (e) => {
    let key = e.key;
    let buttonToHighlight = null;

    // Map keyboard keys to calculator values/actions
    if (key >= '0' && key <= '9') {
      handleInput(key, null);
      buttonToHighlight = document.querySelector(`.key[data-value="${key}"]`);
    } else if (key === '.') {
      handleInput('.', null);
      buttonToHighlight = document.querySelector('.key[data-value="."]');
    } else if (key === '+') {
      handleInput('+', null);
      buttonToHighlight = document.querySelector('.key[data-value="+"]');
    } else if (key === '-') {
      handleInput('-', null);
      buttonToHighlight = document.querySelector('.key[data-value="-"]');
    } else if (key === '*') {
      handleInput('×', null);
      buttonToHighlight = document.querySelector('.key[data-value="×"]');
    } else if (key === '/') {
      handleInput('÷', null);
      buttonToHighlight = document.querySelector('.key[data-value="÷"]');
    } else if (key === '%') {
      handleInput('%', null);
      buttonToHighlight = document.querySelector('.key[data-value="%"]');
    } else if (key === '(' || key === ')') {
      handleInput(key, null);
      buttonToHighlight = document.querySelector(`.key[data-value="${key}"]`);
    } else if (key === '^') {
      handleInput(null, 'pow');
      buttonToHighlight = document.querySelector('.key[data-action="pow"]');
    } else if (key === 'Enter' || key === '=') {
      e.preventDefault(); // Prevent submit or scroll actions
      handleInput(null, 'calculate');
      buttonToHighlight = document.querySelector('.key[data-action="calculate"]');
    } else if (key === 'Backspace') {
      handleInput(null, 'backspace');
      buttonToHighlight = document.querySelector('.key[data-action="backspace"]');
    } else if (key === 'Escape') {
      handleInput(null, 'clear');
      buttonToHighlight = document.querySelector('.key[data-action="clear"]');
    } else if (key.toLowerCase() === 's') {
      handleInput(null, 'sin');
      buttonToHighlight = document.querySelector('.key[data-action="sin"]');
    } else if (key.toLowerCase() === 'c') {
      handleInput(null, 'cos');
      buttonToHighlight = document.querySelector('.key[data-action="cos"]');
    } else if (key.toLowerCase() === 't') {
      handleInput(null, 'tan');
      buttonToHighlight = document.querySelector('.key[data-action="tan"]');
    } else if (key.toLowerCase() === 'l') {
      handleInput(null, 'log');
      buttonToHighlight = document.querySelector('.key[data-action="log"]');
    } else if (key.toLowerCase() === 'n') {
      handleInput(null, 'ln');
      buttonToHighlight = document.querySelector('.key[data-action="ln"]');
    } else if (key.toLowerCase() === 'r') {
      handleInput(null, 'sqrt');
      buttonToHighlight = document.querySelector('.key[data-action="sqrt"]');
    } else if (key.toLowerCase() === 'p') {
      handleInput('pi', null);
      buttonToHighlight = document.querySelector('.key[data-value="π"]');
    } else if (key.toLowerCase() === 'e') {
      handleInput('e', null);
      buttonToHighlight = document.querySelector('.key[data-value="e"]');
    }

    // Trigger visually responsive click highlights for keyboard users
    if (buttonToHighlight) {
      buttonToHighlight.classList.add('keyboard-active');
      setTimeout(() => buttonToHighlight.classList.remove('keyboard-active'), 120);
    }
  });

  // Keyboard Help Guide
  closeGuideBtn.addEventListener('click', () => keyboardGuide.classList.remove('open'));

  // --- Theme Controller ---
  function initTheme() {
    const savedTheme = localStorage.getItem('aerocalc_theme') || 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);
    
    themeToggleBtn.addEventListener('click', () => {
      const currentTheme = document.documentElement.getAttribute('data-theme');
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', newTheme);
      localStorage.setItem('aerocalc_theme', newTheme);
    });
  }

  // --- Calculator Input Handler ---
  function handleInput(value, action) {
    // Hide keyboard guide if anything is typed
    if (keyboardGuide.classList.contains('open') && action !== 'keyboard') {
      keyboardGuide.classList.remove('open');
    }

    if (action) {
      switch (action) {
        case 'clear':
          expression = '';
          break;
        case 'backspace':
          performBackspace();
          break;
        case 'sin':
          appendFunc('sin(');
          break;
        case 'cos':
          appendFunc('cos(');
          break;
        case 'tan':
          appendFunc('tan(');
          break;
        case 'log':
          appendFunc('log(');
          break;
        case 'ln':
          appendFunc('ln(');
          break;
        case 'sqrt':
          appendFunc('sqrt(');
          break;
        case 'sqr':
          appendOperator('^2');
          break;
        case 'pow':
          appendOperator('^');
          break;
        case 'calculate':
          calculateResult();
          break;
        case 'keyboard':
          keyboardGuide.classList.toggle('open');
          break;
      }
    } else if (value) {
      if (['+', '-', '×', '÷', '%'].includes(value)) {
        let op = value === '×' ? '*' : value === '÷' ? '/' : value;
        appendOperator(op);
      } else {
        // Numbers, decimal, brackets, constants
        let val = value;
        if (value === 'π') val = 'pi';
        appendValue(val);
      }
    }

    updateDisplay();
  }

  function appendValue(val) {
    // Edge case: if expression is currently just '0' and we append a digit, replace it
    if (expression === '0' && val >= '0' && val <= '9') {
      expression = val;
    } else {
      expression += val;
    }
  }

  function appendOperator(op) {
    if (expression === '' && op === '-') {
      expression = '-';
      return;
    }
    
    if (expression === '') return;

    const lastChar = expression[expression.length - 1];
    
    // If last character is already an operator, replace it (excluding postfix % and brackets)
    if (['+', '-', '*', '/', '^'].includes(lastChar)) {
      expression = expression.slice(0, -1) + op;
    } else {
      expression += op;
    }
  }

  function appendFunc(func) {
    expression += func;
  }

  function performBackspace() {
    const functions = ['sin(', 'cos(', 'tan(', 'log(', 'ln(', 'sqrt('];
    
    // Check if ending with a scientific function to delete it atomically
    for (const fn of functions) {
      if (expression.endsWith(fn)) {
        expression = expression.slice(0, -fn.length);
        return;
      }
    }

    // Check constants
    if (expression.endsWith('pi')) {
      expression = expression.slice(0, -2);
      return;
    }

    // Default backspace
    expression = expression.slice(0, -1);
  }

  // --- Display Updates & Live Preview ---
  function updateDisplay() {
    // Render formatted display expression
    expressionText.textContent = formatDisplayString(expression);
    
    // Auto-scroll the expression container to the right as it grows
    const container = document.querySelector('.expression-container');
    setTimeout(() => {
      container.scrollLeft = container.scrollWidth;
    }, 0);

    // Live preview evaluation
    if (expression.trim() === '') {
      resultText.textContent = '0';
      resultText.style.color = 'var(--text-primary)';
      previewEquals.classList.remove('show');
      return;
    }

    const preview = tryRealTimeEvaluation(expression, isRadMode);
    if (preview.success) {
      resultText.textContent = formatResult(preview.value);
      resultText.style.color = 'var(--text-secondary)';
      previewEquals.classList.add('show');
    } else {
      // Keep displaying the previous valid result or clear preview indicator
      // but do not display red errors during live typing.
      previewEquals.classList.remove('show');
      resultText.style.color = 'var(--text-secondary)';
    }
  }

  function formatDisplayString(expr) {
    let formatted = expr;
    formatted = formatted.replace(/\*/g, '×');
    formatted = formatted.replace(/\//g, '÷');
    formatted = formatted.replace(/-/g, '−');
    formatted = formatted.replace(/pi/g, 'π');
    formatted = formatted.replace(/sqrt\(/g, '√(');
    return formatted;
  }

  // --- Strict/Final Calculation ---
  function calculateResult() {
    if (expression.trim() === '') return;

    try {
      const tokens = tokenize(expression);
      const processed = processUnaryOperators(tokens);
      const finalTokens = insertImpliedMultiplication(processed);
      const rpn = shuntingYard(finalTokens);
      const result = evaluateRPN(rpn, isRadMode);

      const formattedResult = formatResult(result);
      
      // Save to history list
      saveToHistory(expression, formattedResult);
      
      // Load result as the new expression
      expression = result.toString();
      
      // Update screen state
      resultText.textContent = formattedResult;
      resultText.style.color = 'var(--text-primary)';
      previewEquals.classList.remove('show');
    } catch (error) {
      resultText.textContent = error.message.includes('parentheses') ? 'Syntax Error' : error.message;
      resultText.style.color = 'var(--key-text-action)';
      previewEquals.classList.remove('show');
    }
  }

  // --- History Controllers ---
  function saveToHistory(expr, res) {
    if (res === 'Error' || res === 'Overflow' || res.includes('Undefined')) return;
    
    // Prevent duplicate consecutive additions
    if (history.length > 0 && history[0].expr === expr) return;

    history.unshift({ expr, res });
    
    // Limit history entries to 30
    if (history.length > 30) history.pop();

    localStorage.setItem('aerocalc_history', JSON.stringify(history));
    renderHistory();
  }

  function renderHistory() {
    if (history.length === 0) {
      historyList.innerHTML = '<div class="history-empty">No calculations yet</div>';
      return;
    }

    historyList.innerHTML = '';
    history.forEach((item, index) => {
      const div = document.createElement('div');
      div.className = 'history-item';
      div.innerHTML = `
        <div class="history-item-exp">${formatDisplayString(item.expr)}</div>
        <div class="history-item-res">${item.res}</div>
      `;
      div.addEventListener('click', () => {
        expression = item.expr;
        updateDisplay();
        // Auto-close history panel on narrow screens once selected
        if (window.innerWidth < 800) {
          calculatorWrapper.classList.remove('history-open');
        }
      });
      historyList.appendChild(div);
    });
  }

  // --- Math Parsing Engine Details ---

  function tokenize(expressionStr) {
    const tokens = [];
    let i = 0;

    while (i < expressionStr.length) {
      const char = expressionStr[i];

      // Skip spaces
      if (char === ' ') {
        i++;
        continue;
      }

      // Numbers
      if (isDigit(char) || (char === '.' && isDigit(expressionStr[i + 1]))) {
        let numStr = '';
        while (i < expressionStr.length && (isDigit(expressionStr[i]) || expressionStr[i] === '.')) {
          numStr += expressionStr[i];
          i++;
        }
        if ((numStr.match(/\./g) || []).length > 1) {
          throw new Error('Syntax Error');
        }
        tokens.push({ type: 'NUMBER', value: parseFloat(numStr) });
        continue;
      }

      // Identifiers (Scientific functions or constants)
      if (isAlpha(char)) {
        let name = '';
        while (i < expressionStr.length && isAlpha(expressionStr[i])) {
          name += expressionStr[i];
          i++;
        }

        if (name === 'pi') {
          tokens.push({ type: 'CONSTANT', value: Math.PI });
        } else if (name === 'e') {
          tokens.push({ type: 'CONSTANT', value: Math.E });
        } else if (['sin', 'cos', 'tan', 'log', 'ln', 'sqrt'].includes(name)) {
          tokens.push({ type: 'FUNCTION', value: name });
        } else {
          throw new Error(`Unknown identifier: ${name}`);
        }
        continue;
      }

      // Operators and Brackets
      if (['+', '-', '*', '/', '^', '%', '(', ')'].includes(char)) {
        tokens.push({ type: 'OPERATOR', value: char });
        i++;
        continue;
      }

      throw new Error(`Unexpected character: ${char}`);
    }

    return tokens;
  }

  function isDigit(c) {
    return c >= '0' && c <= '9';
  }

  function isAlpha(c) {
    return (c >= 'a' && c <= 'z') || (c >= 'A' && c <= 'Z');
  }

  function processUnaryOperators(tokens) {
    const processed = [];
    for (let i = 0; i < tokens.length; i++) {
      const token = tokens[i];
      if (token.type === 'OPERATOR' && (token.value === '-' || token.value === '+')) {
        const prev = i > 0 ? tokens[i - 1] : null;
        // Unary if first token, or follows bracket/operator (excluding percentage postfix)
        const isUnary = !prev || 
                        (prev.type === 'OPERATOR' && prev.value !== '%' && prev.value !== ')') || 
                        prev.value === '(';
        if (isUnary) {
          token.type = token.value === '-' ? 'UNARY_MINUS' : 'UNARY_PLUS';
        }
      }
      processed.push(token);
    }
    return processed;
  }

  function insertImpliedMultiplication(tokens) {
    const processed = [];
    for (let i = 0; i < tokens.length; i++) {
      const token = tokens[i];
      if (i > 0) {
        const prev = tokens[i - 1];
        
        // Triggers: e.g. ) ( -> ) * ( or 5 sin -> 5 * sin or 5 pi -> 5 * pi
        const isPrevNumeric = ['NUMBER', 'CONSTANT', ')'].includes(prev.type) || 
                              (prev.type === 'OPERATOR' && prev.value === '%');
        const isCurrentNumericOrOpen = ['CONSTANT', 'FUNCTION', '('].includes(token.type) || 
                                       (token.type === 'OPERATOR' && token.value === '(');
        
        if (isPrevNumeric && isCurrentNumericOrOpen) {
          processed.push({ type: 'OPERATOR', value: '*' });
        }
      }
      processed.push(token);
    }
    return processed;
  }

  // Shunting-Yard Algorithm details
  const PRECEDENCE = {
    '+': 2,
    '-': 2,
    '*': 3,
    '/': 3,
    '^': 4,
    'UNARY_MINUS': 5,
    'UNARY_PLUS': 5,
    '%': 6
  };

  const ASSOCIATIVITY = {
    '+': 'LEFT',
    '-': 'LEFT',
    '*': 'LEFT',
    '/': 'LEFT',
    '^': 'RIGHT',
    'UNARY_MINUS': 'RIGHT',
    'UNARY_PLUS': 'RIGHT'
  };

  function shuntingYard(tokens) {
    const outputQueue = [];
    const operatorStack = [];

    for (const token of tokens) {
      if (token.type === 'NUMBER' || token.type === 'CONSTANT') {
        outputQueue.push(token);
      } else if (token.type === 'FUNCTION') {
        operatorStack.push(token);
      } else if (token.type === 'OPERATOR' && token.value === '%') {
        outputQueue.push(token); // Handle postfix percentage directly in output
      } else if (token.type === 'OPERATOR' || token.type === 'UNARY_MINUS' || token.type === 'UNARY_PLUS') {
        const op1 = token.value;
        const type1 = token.type;
        const key1 = type1 === 'OPERATOR' ? op1 : type1;

        while (operatorStack.length > 0) {
          const topToken = operatorStack[operatorStack.length - 1];
          if (topToken.type === 'FUNCTION') {
            outputQueue.push(operatorStack.pop());
            continue;
          }

          if (topToken.value === '(') {
            break;
          }

          const op2 = topToken.value;
          const type2 = topToken.type;
          const key2 = type2 === 'OPERATOR' ? op2 : type2;

          const p1 = PRECEDENCE[key1];
          const p2 = PRECEDENCE[key2];
          const assoc1 = ASSOCIATIVITY[key1];

          if (p2 > p1 || (p2 === p1 && assoc1 === 'LEFT')) {
            outputQueue.push(operatorStack.pop());
          } else {
            break;
          }
        }
        operatorStack.push(token);
      } else if (token.value === '(') {
        operatorStack.push(token);
      } else if (token.value === ')') {
        let foundMatchingOpen = false;
        while (operatorStack.length > 0) {
          const top = operatorStack[operatorStack.length - 1];
          if (top.value === '(') {
            operatorStack.pop();
            foundMatchingOpen = true;
            break;
          } else {
            outputQueue.push(operatorStack.pop());
          }
        }
        if (!foundMatchingOpen) {
          throw new Error('Mismatched parenthesis');
        }
        if (operatorStack.length > 0 && operatorStack[operatorStack.length - 1].type === 'FUNCTION') {
          outputQueue.push(operatorStack.pop());
        }
      }
    }

    while (operatorStack.length > 0) {
      const top = operatorStack.pop();
      if (top.value === '(' || top.value === ')') {
        throw new Error('Mismatched parenthesis');
      }
      outputQueue.push(top);
    }

    return outputQueue;
  }

  function evaluateRPN(rpnTokens, isRadMode) {
    const stack = [];

    for (const token of rpnTokens) {
      if (token.type === 'NUMBER' || token.type === 'CONSTANT') {
        stack.push(token.value);
      } else if (token.type === 'OPERATOR' && token.value === '%') {
        if (stack.length < 1) throw new Error('Syntax Error');
        const val = stack.pop();
        stack.push(val / 100);
      } else if (token.type === 'UNARY_MINUS') {
        if (stack.length < 1) throw new Error('Syntax Error');
        const val = stack.pop();
        stack.push(-val);
      } else if (token.type === 'UNARY_PLUS') {
        if (stack.length < 1) throw new Error('Syntax Error');
        // No action needed
      } else if (token.type === 'OPERATOR') {
        if (stack.length < 2) throw new Error('Syntax Error');
        const b = stack.pop();
        const a = stack.pop();

        switch (token.value) {
          case '+': stack.push(a + b); break;
          case '-': stack.push(a - b); break;
          case '*': stack.push(a * b); break;
          case '/':
            if (b === 0) throw new Error('Division by zero');
            stack.push(a / b);
            break;
          case '^': stack.push(Math.pow(a, b)); break;
          default: throw new Error('Syntax Error');
        }
      } else if (token.type === 'FUNCTION') {
        if (stack.length < 1) throw new Error('Syntax Error');
        const val = stack.pop();

        switch (token.value) {
          case 'sin':
            if (!isRadMode) {
              const deg = val % 360;
              // Clean evaluation for exact fractional nodes
              if (deg === 0 || Math.abs(deg) === 180) stack.push(0);
              else if (deg === 90 || deg === -270) stack.push(1);
              else if (deg === -90 || deg === 270) stack.push(-1);
              else stack.push(Math.sin(val * Math.PI / 180));
            } else {
              let res = Math.sin(val);
              if (Math.abs(res) < 1e-14) res = 0;
              stack.push(res);
            }
            break;
          case 'cos':
            if (!isRadMode) {
              const deg = val % 360;
              if (Math.abs(deg) === 90 || Math.abs(deg) === 270) stack.push(0);
              else if (deg === 0) stack.push(1);
              else if (Math.abs(deg) === 180) stack.push(-1);
              else stack.push(Math.cos(val * Math.PI / 180));
            } else {
              let res = Math.cos(val);
              if (Math.abs(res) < 1e-14) res = 0;
              stack.push(res);
            }
            break;
          case 'tan':
            if (!isRadMode) {
              const deg = val % 360;
              if (Math.abs(deg) === 90 || Math.abs(deg) === 270) {
                throw new Error('Undefined');
              } else if (deg === 0 || Math.abs(deg) === 180) {
                stack.push(0);
              } else {
                stack.push(Math.tan(val * Math.PI / 180));
              }
            } else {
              let res = Math.tan(val);
              if (Math.abs(res) > 1e14) throw new Error('Undefined');
              if (Math.abs(res) < 1e-14) res = 0;
              stack.push(res);
            }
            break;
          case 'sqrt':
            if (val < 0) throw new Error('Invalid input');
            stack.push(Math.sqrt(val));
            break;
          case 'log':
            if (val <= 0) throw new Error('Invalid input');
            stack.push(Math.log10(val));
            break;
          case 'ln':
            if (val <= 0) throw new Error('Invalid input');
            stack.push(Math.log(val));
            break;
          default: throw new Error('Syntax Error');
        }
      }
    }

    if (stack.length !== 1) {
      throw new Error('Syntax Error');
    }

    return stack[0];
  }

  function tryRealTimeEvaluation(expressionStr, isRadMode) {
    if (!expressionStr.trim()) {
      return { success: false };
    }

    try {
      let sanitizedExpr = expressionStr;

      // Close open parentheses for live preview calculations
      let openCount = 0;
      for (const char of sanitizedExpr) {
        if (char === '(') openCount++;
        else if (char === ')') openCount--;
      }
      if (openCount > 0) {
        sanitizedExpr += ')'.repeat(openCount);
      }

      // Do not preview intermediate dangling operators
      const trimmed = sanitizedExpr.trim();
      const lastChar = trimmed[trimmed.length - 1];
      if (['+', '-', '*', '/', '^'].includes(lastChar)) {
        return { success: false };
      }

      // Check if expression is just a raw number or constant, no need to show preview
      // (avoiding showing preview = 5 when user just typed 5)
      const tokens = tokenize(sanitizedExpr);
      if (tokens.length === 1 && (tokens[0].type === 'NUMBER' || tokens[0].type === 'CONSTANT')) {
        return { success: false };
      }

      const processed = processUnaryOperators(tokens);
      const finalTokens = insertImpliedMultiplication(processed);
      const rpn = shuntingYard(finalTokens);
      const result = evaluateRPN(rpn, isRadMode);

      return { success: true, value: result };
    } catch (e) {
      return { success: false, error: e.message };
    }
  }

  function formatResult(val) {
    if (typeof val !== 'number' || isNaN(val)) return 'Error';
    if (!isFinite(val)) return 'Overflow';

    // Round values that are very close to integers
    const epsilon = 1e-12;
    if (Math.abs(val - Math.round(val)) < epsilon) {
      val = Math.round(val);
    }

    // Use scientific notation for huge and miniscule numbers
    if (Math.abs(val) > 1e14 || (Math.abs(val) < 1e-10 && val !== 0)) {
      return val.toExponential(8).replace(/e\+?/, 'e');
    }

    // Limit floating point decimals to 10 and prune trailing zeroes
    return Number(val.toFixed(10)).toString();
  }
});
