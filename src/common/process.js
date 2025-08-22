// 根据字符串生成函数
export function makeFunction(expr) {
    // new Function 构造器，安全起见只允许使用 Math
    return new Function("X", "with(Math){ return " + expr + "; }");
  }
  
  // 数值梯度 (1D)
  function numericalGrad(f, h = 1e-6) {
    return function (x) {
      return (f(x + h) - f(x - h)) / (2 * h);
    };
  }
  function numericalHess(f, h = 1e-5) {
    return function (x) {
      return (f(x + h) - 2 * f(x) + f(x - h)) / (h * h);
    }
  }
  // 牛顿法 (BFGS, 1D)
 export function newtonMethod(expr, x0, maxIter=100, tol=1e-6) {
    const f = makeFunction(expr);
    const grad = numericalGrad(f);
    const hess = numericalHess(f); // 数值计算二阶导数
  
    let x = x0;
    for (let k = 0; k < maxIter; k++) {
      const g = grad(x);
      // console.info(g,k)
      if (Math.abs(g) < tol) break;
      
      const H = hess(x);
      // 修正 Hessian 为正定（避免负定）
      const H_safe = Math.abs(H) + 1e-6; 
      const p = -g / H_safe; // 牛顿方向
      x += p; // 步长固定为 1（牛顿法特性）
    }
    return { x, fx: f(x) };
  }
  
  export function process(exp){

    var temp=exp.split(":")[0]
    var expr= constructExpression(temp)
    return makeFunction(expr)
  }
  function replacePowers(expr) {
    while (true) {
      let stack = [];
      let pos = -1;
      
      // 从右向左找第一个不在括号内的'^'
      for (let i = expr.length - 1; i >= 0; i--) {
        if (expr[i] === ')') {
          stack.push(i);
        } else if (expr[i] === '(') {
          if (stack.length === 0) throw new Error("Unmatched parenthesis");
          stack.pop();
        } else if (expr[i] === '^' && stack.length === 0) {
          pos = i;
          break;
        }
      }
      
      if (pos === -1) break; // 没有找到'^'，结束循环
      
      // 提取右操作数
      let rightOp = "";
      let stack2 = [];
      let j = pos + 1;
      while (j < expr.length) {
        if (expr[j] === '(') {
          stack2.push(j);
        } else if (expr[j] === ')') {
          if (stack2.length === 0) break;
          stack2.pop();
        } else if (stack2.length === 0 && "+-*/^".includes(expr[j])) {
          break;
        }
        rightOp += expr[j];
        j++;
      }
      
      // 提取左操作数
      let leftOp = "";
      let stack3 = [];
      let k = pos - 1;
      while (k >= 0) {
        if (expr[k] === ')') {
          stack3.push(k);
        } else if (expr[k] === '(') {
          if (stack3.length === 0) break;
          stack3.pop();
        } else if (stack3.length === 0 && "+-*/^".includes(expr[k])) {
          break;
        }
        leftOp = expr[k] + leftOp;
        k--;
      }
      
      // 构造新的表达式
      expr = expr.substring(0, k + 1) + "Math.pow(" + leftOp + "," + rightOp + ")" + expr.substring(j);
    }
    
    return expr;
  }
  
export  function constructExpression(expr) {
    // 1. 移除所有空格
    let e = expr.replace(/\s/g, '');
    
    // 2. 替换变量 x/X 为统一的大写 X
    e = e.replace(/x/gi, 'X');
    
    // 3. 替换常量（使用单词边界确保完整匹配）
    e = e.replace(/\be\b/gi, 'Math.E');
    e = e.replace(/\bpi\b/gi, 'Math.PI');
    
    // 4. 替换函数（使用单词边界确保完整匹配）
    e = e.replace(/\bcos\b/gi, 'Math.cos');
    e = e.replace(/\bsin\b/gi, 'Math.sin');
    e = e.replace(/\bln\b/gi, 'Math.log');
    
    // 5. 处理隐式乘法 - 在以下情况插入乘号(*)
    //    a) 数字与X之间: 2X -> 2*X
    e = e.replace(/(\d)(X)/g, '$1*$2');
    //    b) 数字与函数之间: 2cos(X) -> 2*Math.cos(X)
    e = e.replace(/(\d)(Math\.[a-zA-Z]+)/g, '$1*$2');
    //    c) X与函数之间: Xcos(X) -> X*Math.cos(X)
    e = e.replace(/(X)(Math\.[a-zA-Z]+)/g, '$1*$2');
    //    d) 函数与函数之间: cos(X)sin(X) -> Math.cos(X)*Math.sin(X)
    e = e.replace(/(Math\.[a-zA-Z]+\))(Math\.[a-zA-Z]+)/g, '$1*$2');
    //    e) 括号与数字之间: 2(X+1) -> 2*(X+1)
    e = e.replace(/(\d)(\()/g, '$1*$2');
    //    f) 括号与X之间: (X+1)X -> (X+1)*X
    e = e.replace(/(\))(X)/g, '$1*$2');
    //    g) 括号与函数之间: (X+1)cos(X) -> (X+1)*Math.cos(X)
    e = e.replace(/(\))(Math\.[a-zA-Z]+)/g, '$1*$2');
    //    h) 数字与括号之间: 2(3+4) -> 2*(3+4)
    e = e.replace(/(\d)(\()/g, '$1*$2');
    //    i) X与括号之间: X(3+4) -> X*(3+4)
    e = e.replace(/(X)(\()/g, '$1*$2');
    //    j) 函数与括号之间: cos(X)(X+1) -> Math.cos(X)*(X+1)
    e = e.replace(/(Math\.[a-zA-Z]+\))(\()/g, '$1*$2');
    e=e.replace(/(\^)/g,'**')
    
    // 6. 处理幂运算符 - 将^替换为Math.pow，并处理右结合性
    e = replacePowers(e);
    
    return e;
  }