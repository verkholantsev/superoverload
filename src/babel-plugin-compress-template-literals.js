module.exports = function(babel) {
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
            templateElement.value.raw = templateElement.value.raw
              .replace(/^\s+/gm, '')
              .replace(/\n/gm, '');
            templateElement.value.cooked = templateElement.value.cooked
              .replace(/^\s+/gm, '')
              .replace(/\n/gm, '');
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
