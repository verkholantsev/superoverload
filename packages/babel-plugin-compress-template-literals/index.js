function isWhitespace(char) {
  return /\s/.test(char);
}

function isNonWhitespace(char) {
  return /[^\s]/.test(char);
}

function isStringBoundary(char) {
  return char === "'" || char === '"' || char === '`';
}

function compressString(input) {
  const output = [];
  let i = 0;
  let isBetweenWords = false;
  let isInString = false;
  while (i < input.length) {
    const char = input[i];
    const previousChar = output[output.length - 1];

    if (isStringBoundary(char) && previousChar !== '\\') {
      isInString = !isInString;
      output.push(char);
    } else if (isInString) {
      output.push(char);
    } else if (isNonWhitespace(char)) {
      if (
        isBetweenWords &&
        output.length > 0 &&
        /\w/.test(previousChar) &&
        /\w/.test(char)
      ) {
        output.push(' ');
      }
      output.push(char);
      isBetweenWords = false;
    } else if (isWhitespace(char)) {
      isBetweenWords = true;
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
          path.node.arguments[0].quasis.forEach(templateElement => {
            templateElement.value.raw = compressString(
              templateElement.value.raw,
            );
            templateElement.value.cooked = compressString(
              templateElement.value.cooked,
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
