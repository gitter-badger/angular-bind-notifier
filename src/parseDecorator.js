(function () {

  'use strict';

  function cloneExpression (getter) {
    return _.merge(function () {
      return getter.apply(this, arguments);
    }, getter);
  }

  function wrapper (expr, notifier) {
    return _.wrap(expr.$$watchDelegate, function (originalWatchDelegate, scope, listener, objectEquality, parsedExpression ) {
      scope.$on('$$rebind::' + notifier, function () {
        return originalWatchDelegate.call(this, scope, listener, objectEquality, parsedExpression);
      });

      return originalWatchDelegate.call(this, scope, listener, objectEquality, parsedExpression);
    });
  }

  function $parseDecorator ($delegate, bindNotifierRegex) {
    var wrappedFn = _.wrap($delegate, function ($parse, exp, interceptor) {
      var match, expression, rawExpression, notifier;

      if (_.isString(exp) && (match = exp.match(bindNotifierRegex))) {
        notifier      = match[1];
        rawExpression = match[2];

        expression = cloneExpression($parse.apply(this, ['::' + rawExpression, interceptor]));
        expression.$$watchDelegate = wrapper(expression, notifier);

        return expression;
      } else {
        return $parse.apply(this, _.compact([exp, interceptor]));
      }
    });
    wrappedFn.$inject = ['$parse', 'exp', 'interceptor'];

    return wrappedFn;
  }
  $parseDecorator.$inject = ['$delegate', 'bindNotifierRegex'];

  angular
    .module('angular-bind-notifier')
    .constant('bindNotifierRegex', /^:([a-zA-Z0-9][\w-]*):(.+)$/)
    .config(function ($provide) {
      $provide.decorator('$parse', $parseDecorator);
    });

}());