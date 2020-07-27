// 还原sojson中的字符串

const parser = require("@babel/parser");
const traverse = require("@babel/traverse").default;
const generator = require("@babel/generator").default;
const t = require("@babel/types");
const fse = require("fs-extra");


fse.readFile("/home/allen/allen/codes/js_crack_learning/gsxt_jsl/source_new.js", encoding = "utf-8", function (err, data) {
    // 代码转ast树状结构
    var ast = parser.parse(data);

    // 处理方法, 这种使用于，前三个是解析加密字符串的方法，第三个是var arg = function () {},调用arg()替换字符串
    // console.log("正在处理字符串替换....");
    // ast = replaceFn(ast);  // 替换字符串

    // 字符串+字符串形式还原: "stri" + "ng", 有可能十多个相加的情况，所以循环多次处理了
    console.log("正在处理字符串相加的情况");
    for (i=0; i<10; i++) {
        addString(ast);
    }

    // 替换对象中函数调用，字符串，二项式
    console.log("正在还原二项式替换....");
    replaceObject(ast);

    // 还原while循环
    // console.log("正在还原while循环语句....");
    // replaceWhile(ast);
    //
    // 还原三目表达式
    // replaceTernary(ast);

    // 替换逗号表达式，将var cy, cz, cA = Array； 转变为var cy; var cz; var cA = Array;
    console.log("正在还原逗号符替换....");
    replaceDotStatment(ast);


    // 替换16进制的数字，0x0
    console.log("正在还原16进制....");
    replaceX16(ast);

    // 检查变量是否被引用，如果没有就删除路径
    console.log("删除没有被引用的变量");
    delete_no_use_variable(ast);

    // 将ast转化为代码
    var {code} = generator(ast, {compact: true});
    // var {code} = generator(ast);
    code = code.replace(/\!\!\[\]/g, true).replace(/\!\[\]/g, false);
    // 保存代码
    fse.writeFile("/home/allen/allen/codes/js_crack_learning/gsxt_jsl/source_new_new.js", code, function (err) {
        if (!err) {
            console.log("转化完成");
        }
    })
});


// 转化字符串, 默认前三个对象为生成字符串的方法，第一个为一个加密字符串的数组，
// 第二个对象为处理加密字符串的自执行代码块, 第三个为调用生成字符串的接口
function replaceFn(ast) {
    const restAst = findFunction(ast);

    traverse(restAst, {
        CallExpression: function (path) {
            const node = path.node;

            // 判断正确的callExpression
            if (!t.isIdentifier(node.callee, {name: funcName})) return;
            if (node.arguments.length < 1) return;

            if (node.arguments.length === 1) {
                const param = node.arguments[0].value;
                var value = func(param);
            } else if (node.arguments.length === 2) {
                const param1 = node.arguments[0].value;
                const param2 = node.arguments[1].value;
                var value = func(param1, param2);
            } else {
                return;
            }

            // 将方法调用换成字符串
            path.replaceWith(t.stringLiteral(value));

        }
    });

    return ast;
}

function findFunction(ast) {
    // 默认前三个是生成字符串的代码, 提取解密代码，和剩余的代码
    const decryptNodes = ast.program.body.slice(0, 3);
    const restNodes = ast.program.body.slice(3);

    // 生成解密代码
    ast.program.body = decryptNodes;
    const {code} = generator(ast, {
        compact: true,
    });

    eval(code);

    func = eval(decryptNodes[2].declarations[0].id.name);
    funcName = decryptNodes[2].declarations[0].id.name;
    console.log(funcName);

    ast.program.body = restNodes;
    return ast;
}

function replaceX16(ast) {
    traverse(ast, {
        NumericLiteral: function (path) {
            delete path.node.extra;
        },
        StringLiteral: function (path) {
            if (path.node.extra === undefined) {
                return;
            }
            delete path.node.extra;
        }
    })
}

function replaceObject(ast) {
    console.log("正在处理二项式替换。。。。");
    traverse(ast, {
        // 替换方法表达式语句
        FunctionExpression: replaceObject2,

        // 替换函数定义中的对象语句中的二项式，函数调用、逻辑表达式
        FunctionDeclaration: replaceObject3,

    });

    /**
     *
     var nodes = ast.program.body;
     console.log("处理节点数：", nodes.length);
     // 遍历body中每个节点处理
     nodes.map(function (node) {
        // 不是方法的跳过
        if (!t.isFunctionDeclaration(node) && !t.isVariableDeclaration(node)) return;
        if (t.isVariableDeclaration(node) && t.isVariableDeclarator(node.declarations[0]) && t.isFunctionExpression(node.declarations[0].init)) {
            node = node.declarations[0].init;
        }

        // 如果是方法，但是body的第一个语句不是var aM = {“aaa”: ...}的形式的，也跳过
        if (!t.isBlockStatement(node.body) || node.body.body.length < 2) return;
        if (!t.isVariableDeclaration(node.body.body[0], {kind: "var"}) || !t.isVariableDeclarator(node.body.body[0].declarations[0])) return;
        if (!t.isObjectExpression(node.body.body[0].declarations[0].init) || node.body.body[0].declarations[0].init.properties.length < 1) return;

        // console.log(node);
        var objName = node.body.body[0].declarations[0].id.name;
        var objProperties = node.body.body[0].declarations[0].init.properties;
        console.log("对象名：" + objName);

        // 生成一个空语法树, 遍历替换时使用
        var ast2 = parser.parse("");
        ast2.program.body = node;
        // 遍历对象的属性,挨个匹配
        objProperties.map(function (propNode) {
            // 对象的属性名
            var propName = propNode.key.value;
            console.log("处理对象的属性名： " + propName);

            // 判断属性返回值的节点类型，如果对象的属性是CallExpression，则遍历函数调用的节点
            if (t.isFunctionExpression(propNode.value) && t.isCallExpression(propNode.value.body.body[0].argument)) {
                traverse(ast2, {
                    CallExpression: function (path) {
                        // 判断是否是需要替换的节点
                        if (!t.isMemberExpression(path.node.callee)) return;
                        if (!t.isIdentifier(path.node.callee.object, {name: objName})) return;
                        if (!t.isStringLiteral(path.node.callee.property, {value: propName})) return;

                        // 判断调用方法的参数个数
                        if (path.node.arguments.length === 1) {
                            var arg = path.node.arguments[0].name;
                            path.replaceWith(t.callExpression(t.identifier(arg), []));
                        }

                        // 如果调用方法的参数为2，则是a(b)的形式
                        if (path.node.arguments.length > 1) {
                            var args = path.node.arguments;
                            path.replaceWith(t.callExpression(t.identifier(args[0].name), args.slice(1)));
                        }
                    }
                })
            }

            // 判断属性返回值的节点类型，如果对象的属性是BinaryExpression， 则遍历函数调用的节点
            if (t.isFunctionExpression(propNode.value) && t.isBinaryExpression(propNode.value.body.body[0].argument)) {
                traverse(ast2, {
                    CallExpression: function (path) {
                        // 判断是否是需要替换的节点
                        if (!t.isMemberExpression(path.node.callee)) return;
                        if (!t.isIdentifier(path.node.callee.object, {name: objName})) return;
                        if (!t.isStringLiteral(path.node.callee.property, {value: propName})) return;

                        // 由于BinaryExpression的参数就只有两个，所以不用判断参数个数
                        const args = path.node.arguments;
                        // 二项式操作符
                        const operation = propNode.value.body.body[0].argument.operator;
                        path.replaceWith(t.binaryExpression(operation, args[0], args[1]));
                    }
                })
            }

            // 判断属性如果是字符串，直接替换
            if (t.isStringLiteral(propNode.value)) {
                traverse(ast2, {
                    MemberExpression: function (path) {
                        if (!t.isIdentifier(path.node.object, {name: objName})) return;
                        if (!t.isStringLiteral(path.node.property, {value: propName})) return;
                        // 去字符串的值
                        const string = propNode.value.value;
                        console.log("要替换的字符串： ", string);
                        // 替换节点
                        path.replaceWith(t.stringLiteral(string));
                    }
                })
            }
        })

    })
     * @type {Array<Statement>}
     */
}

function replaceObject2(path) {
    var node = path.node;
    // 如果是方法，但是body的第一个语句不是var aM = {“aaa”: ...}的形式的，也跳过
    if (!t.isBlockStatement(node.body) || node.body.body.length < 2) return;
    if (!t.isVariableDeclaration(node.body.body[0], {kind: "var"}) || !t.isVariableDeclarator(node.body.body[0].declarations[0])) return;
    // if (!t.isObjectExpression(node.body.body[0].declarations[0].init) || node.body.body[0].declarations[0].init.properties.length < 1) return;
    if (!t.isObjectExpression(node.body.body[0].declarations[0].init)) return;

    // console.log(node);
    var objName = node.body.body[0].declarations[0].id.name;
    var objProperties = node.body.body[0].declarations[0].init.properties;

    // 生成一个空语法树, 遍历替换时使用
    var ast2 = parser.parse("");
    ast2.program.body = node;
    // 遍历对象的属性,挨个匹配
    objProperties.map(function (propNode) {
        // 对象的属性名
        var propName = propNode.key.value;
        console.log("处理对象的属性名： " + propName);

        // 判断属性返回值的节点类型，如果对象的属性是CallExpression，则遍历函数调用的节点
        if (t.isFunctionExpression(propNode.value) && t.isCallExpression(propNode.value.body.body[0].argument)) {
            traverse(ast2, {
                CallExpression: function (path) {
                    // 判断是否是需要替换的节点
                    if (!t.isMemberExpression(path.node.callee)) return;
                    if (!t.isIdentifier(path.node.callee.object, {name: objName})) return;
                    if (!t.isStringLiteral(path.node.callee.property, {value: propName})) return;

                    // 判断调用方法的参数个数
                    if (path.node.arguments.length === 1) {
                        var arg = path.node.arguments[0].name;
                        path.replaceWith(t.callExpression(t.identifier(arg), []));
                    }

                    // 如果调用方法的参数为2，则是a(b)的形式
                    if (path.node.arguments.length > 1) {
                        var args = path.node.arguments;
                        path.replaceWith(t.callExpression(t.identifier(args[0].name), args.slice(1)));
                    }
                }
            })
        }

        // 判断属性返回值的节点类型，如果对象的属性是BinaryExpression， 则遍历函数调用的节点
        if (t.isFunctionExpression(propNode.value) && t.isBinaryExpression(propNode.value.body.body[0].argument)) {
            traverse(ast2, {
                CallExpression: function (path) {
                    // 判断是否是需要替换的节点
                    if (!t.isMemberExpression(path.node.callee)) return;
                    if (!t.isIdentifier(path.node.callee.object, {name: objName})) return;
                    if (!t.isStringLiteral(path.node.callee.property, {value: propName})) return;

                    // 由于BinaryExpression的参数就只有两个，所以不用判断参数个数
                    const args = path.node.arguments;
                    // 二项式操作符
                    const operation = propNode.value.body.body[0].argument.operator;
                    path.replaceWith(t.binaryExpression(operation, args[0], args[1]));
                }
            })
        }

        // 判断属性如果是字符串，直接替换
        if (t.isStringLiteral(propNode.value)) {
            traverse(ast2, {
                MemberExpression: function (path) {
                    if (!t.isIdentifier(path.node.object, {name: objName})) return;
                    if (!t.isStringLiteral(path.node.property, {value: propName})) return;
                    // 去字符串的值
                    const string = propNode.value.value;
                    console.log("要替换的字符串： ", string);
                    // 替换节点
                    path.replaceWith(t.stringLiteral(string));
                }
            })
        }
    })

}

function replaceObject3(path) {
    var node = path.node;
    // 不是方法的跳过
    if (!t.isFunctionDeclaration(node) && !t.isVariableDeclaration(node)) return;
    if (t.isVariableDeclaration(node) && t.isVariableDeclarator(node.declarations[0]) && t.isFunctionExpression(node.declarations[0].init)) {
        node = node.declarations[0].init;
    }

    // 如果是方法，但是body的第一个语句不是var aM = {“aaa”: ...}的形式的，也跳过
    if (!t.isBlockStatement(node.body) || node.body.body.length < 2) return;
    if (!t.isVariableDeclaration(node.body.body[0], {kind: "var"}) || !t.isVariableDeclarator(node.body.body[0].declarations[0])) return;
    if (!t.isObjectExpression(node.body.body[0].declarations[0].init) || node.body.body[0].declarations[0].init.properties.length < 1) return;

    // console.log(node);
    var objName = node.body.body[0].declarations[0].id.name;
    var objProperties = node.body.body[0].declarations[0].init.properties;
    // console.log("对象名：" + objName);

    // 生成一个空语法树, 遍历替换时使用
    var ast2 = parser.parse("");
    ast2.program.body = node;
    // 遍历对象的属性,挨个匹配
    objProperties.map(function (propNode) {
        // 对象的属性名
        var propName = propNode.key.value;
        // console.log("处理对象的属性名： " + propName);

        // 判断属性返回值的节点类型，如果对象的属性是CallExpression，则遍历函数调用的节点
        if (t.isFunctionExpression(propNode.value) && t.isCallExpression(propNode.value.body.body[0].argument)) {
            traverse(ast2, {
                CallExpression: function (path) {
                    // 判断是否是需要替换的节点
                    if (!t.isMemberExpression(path.node.callee)) return;
                    if (!t.isIdentifier(path.node.callee.object, {name: objName})) return;
                    if (!t.isStringLiteral(path.node.callee.property, {value: propName})) return;

                    // 判断调用方法的参数个数
                    if (path.node.arguments.length === 1) {
                        var arg = path.node.arguments[0].name;
                        path.replaceWith(t.callExpression(t.identifier(arg), []));
                    }

                    // 如果调用方法的参数为2，则是a(b)的形式
                    if (path.node.arguments.length > 1) {
                        var args = path.node.arguments;
                        path.replaceWith(t.callExpression(t.identifier(args[0].name), args.slice(1)));
                    }
                }
            })
        }

        // 判断属性返回值的节点类型，如果对象的属性是BinaryExpression， 则遍历函数调用的节点
        if (t.isFunctionExpression(propNode.value) && t.isBinaryExpression(propNode.value.body.body[0].argument)) {
            traverse(ast2, {
                CallExpression: function (path) {
                    // 判断是否是需要替换的节点
                    if (!t.isMemberExpression(path.node.callee)) return;
                    if (!t.isIdentifier(path.node.callee.object, {name: objName})) return;
                    if (!t.isStringLiteral(path.node.callee.property, {value: propName})) return;

                    // 由于BinaryExpression的参数就只有两个，所以不用判断参数个数
                    const args = path.node.arguments;
                    // 二项式操作符
                    const operation = propNode.value.body.body[0].argument.operator;
                    path.replaceWith(t.binaryExpression(operation, args[0], args[1]));
                }
            })
        }

        // 判断属性如果是字符串，直接替换
        if (t.isStringLiteral(propNode.value)) {
            traverse(ast2, {
                MemberExpression: function (path) {
                    if (!t.isIdentifier(path.node.object, {name: objName})) return;
                    if (!t.isStringLiteral(path.node.property, {value: propName})) return;
                    // 去字符串的值
                    const string = propNode.value.value;
                    console.log("要替换的字符串： ", string);
                    // 替换节点
                    path.replaceWith(t.stringLiteral(string));
                }
            })
        }
    })

}

function replaceDotStatment(ast) {
    traverse(ast, {
        VariableDeclaration: function (path) {
            if (path.node.kind !== "var" || path.node.declarations.length < 2) return;

            var newVariableStmArr = path.node.declarations.map(function (n) {
                return t.variableDeclaration("var", [n]);
            });

            path.replaceWithMultiple(newVariableStmArr);
        },

        ExpressionStatement: function (path) {
            if (!t.isSequenceExpression(path.node.expression) || path.node.expression.expressions.length < 2) return;

            var newStmArr = path.node.expression.expressions.map(function (n) {
                return t.expressionStatement(n);
            });

            path.replaceWithMultiple(newStmArr);
        }

    })
}

/**
 * 还原while循环，该while循环
 * @param ast
 */
function replaceWhile(ast) {
    console.log("还原while循环语句");
    traverse(ast, {
        WhileStatement: function (path) {
            // 判断while中的test部分是true
            if (!t.isUnaryExpression(path.node.test)) return;

            var testStm = path.node.test;
            var testAst = parser.parse("");
            testAst.program.body = [testStm];
            var {code} = generator(testAst);
            var testValue = eval(code);
            if (testValue !== true) return;

            // while的body的body中至少有一个switch语句，和一个break语句
            if (!t.isBlockStatement(path.node.body) || path.node.body.body.length !== 2) return;
            if (!t.isSwitchStatement(path.node.body.body[0]) || !t.isBreakStatement(path.node.body.body[1])) return;

            var swtStm = path.node.body.body[0];
            // 通过SwitchStatement语句的discriminant判断调用的数组名称和初始值
            if (!t.isMemberExpression(swtStm.discriminant) || !t.isIdentifier(swtStm.discriminant.object) || !t.isUpdateExpression(swtStm.discriminant.property)) return;

            var objName = swtStm.discriminant.object.name;  // 获取数组变量名称
            var propName = swtStm.discriminant.property.argument.name;  // 获取索引的变量名
            var caseStm = swtStm.cases;  // 获取所有的case语句

            // 遍历while所在的方法，找到数组的值，和索引的初始值
            var parentFuncPath = path.getFunctionParent();
            console.log(objName, propName);

            // 遍历父方法，找到数组的值，和索引初始值.
            var startIndex, arr; // 定义索引初始值，控制循环数组
            parentFuncPath.traverse({
                VariableDeclarator: function (path2) {
                    if (!t.isIdentifier(path2.node.id, {name: objName}) && !t.isIdentifier(path2.node.id, {name: propName})) return;

                    // 如果id是数组名则eval出数组的实际数组值
                    if (path2.node.id.name === objName) {
                        const arrAst = parser.parse("");
                        arrAst.program.body = [path2.node.init];
                        var {code} = generator(arrAst);
                        console.log(code);
                        arr = eval(code);
                        console.log(arr)
                    }

                    if (path2.node.id.name === propName) {
                        startIndex = path2.node.init.value;
                    }


                }
            });

            // 将要替换while语句的语句数组
            var stmArr = [];
            for (var i = startIndex; i < arr.length; i++) {
                const caseValue = arr[i];

                for (j = 0; j < caseStm.length; j++) {
                    const currCase = caseStm[j];
                    if (currCase.test.value === caseValue) {
                        var rightCase = currCase;
                    }
                }

                var stmArrTmp = rightCase.consequent.filter(function (n2) {
                    return !t.isContinueStatement(n2);
                });

                stmArr = stmArr.concat(stmArrTmp);
            }

            path.replaceWithMultiple(stmArr);

        }
    })
}

function delete_no_use_variable(ast) {
    traverse(ast, {
        VariableDeclaration: function (path) {
            if (path.node.kind !== "var") return;
            if (path.node.declarations.length < 1) return;

            var varNode = path.node.declarations[0];

            if (!t.isVariableDeclarator(varNode)) return;

            if (!t.isIdentifier(varNode.id) || !varNode.init) return;

            console.log("=======");
            var variableName = varNode.id.name;
            // path的当前作用域下的引用和作用域的绑定关系
            console.log(variableName, "是否被引用：", path.scope.getBinding(variableName).referenced);
            if (!path.scope.getBinding(variableName).referenced) {
                path.remove();
            }

        }
    });
}

function addString(ast) {
    traverse(ast, {
        BinaryExpression: function (path) {
            if (t.isStringLiteral(path.node.left) && t.isStringLiteral(path.node.right) && path.node.operator === "+") {
                var leftStr = path.node.left.value;
                var rightStr = path.node.right.value;
                // var operator = path.node.operator;
                var realStr = leftStr + rightStr;
                path.replaceWith(t.stringLiteral(realStr));
            }
        }
    })
}