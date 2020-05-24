function isWhitespace(char) {
  return /\s/.test(char);
}

function isNonWhitespace(char) {
  return /[^\s]/.test(char);
}

function isStringBoundary(char) {
  return char === "'" || char === '"' || char === '`';
}

function initMutableExpressionContext() {
  let isBetweenWords = false;
  let stringLeftBoundaryChar = null;

  return {
    setIsBetweenWords(value) {
      isBetweenWords = value;
    },
    isBetweenWords() {
      return isBetweenWords;
    },
    setStringLeftBoundaryChar(value) {
      stringLeftBoundaryChar = value;
    },
    doesCharMatchLeftBoundaryChar(char) {
      return char === stringLeftBoundaryChar;
    },
    isWithinString() {
      return stringLeftBoundaryChar != null;
    },
  };
}

function compressString(input, mutableContext) {
  const output = [];
  let i = 0;
  while (i < input.length) {
    const char = input[i];
    const previousChar = output[output.length - 1];

    if (isStringBoundary(char) && previousChar !== '\\') {
      if (!mutableContext.isWithinString()) {
        mutableContext.setStringLeftBoundaryChar(char);
      } else if (mutableContext.doesCharMatchLeftBoundaryChar(char)) {
        mutableContext.setStringLeftBoundaryChar(null);
      }
      output.push(char);
    } else if (mutableContext.isWithinString()) {
      output.push(char);
    } else if (isNonWhitespace(char)) {
      if (
        mutableContext.isBetweenWords() &&
        output.length > 0 &&
        /\w/.test(previousChar) &&
        /\w/.test(char)
      ) {
        output.push(' ');
      }
      output.push(char);
      mutableContext.setIsBetweenWords(false);
    } else if (isWhitespace(char)) {
      mutableContext.setIsBetweenWords(true);
    }

    i++;
  }
  return output.join('');
}

module.exports = function (babel) {
  const {types: t} = babel;

  return {
    name: 'ast-transform', // not required
    visitor: {
      FunctionDeclaration(path) {
        if (path.node.id.name === 'compress') {
          path.remove();
        }
      },
      CallExpression(path) {
        if (path.node.callee.name === 'compress') {
          const mutableContextForCooked = initMutableExpressionContext();
          const mutableContextForRaw = initMutableExpressionContext();

          path.node.arguments[0].quasis.forEach(templateElement => {
            templateElement.value.raw = compressString(
              templateElement.value.raw,
              mutableContextForRaw,
            );
            templateElement.value.cooked = compressString(
              templateElement.value.cooked,
              mutableContextForCooked,
            );
          });
          path.replaceWith(
            t.templateLiteral(
              path.node.arguments[0].quasis,
              path.node.arguments[0].expressions,
            ),
          );
        }
      },
    },
  };
};
