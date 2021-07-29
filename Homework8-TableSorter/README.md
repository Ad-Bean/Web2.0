# Homework8

## 题目一 优化 Optimization

|    作业名称    | 优化前 LoC | 优化后 LoC |
| :------------: | :--------: | :--------: |
|   Calculator   |     90     |     80     |
|      Maze      |     57     |     50     |
|  Whac-a-mole   |     98     |     61     |
| Fifteen Puzzle |    217     |    186     |

**注**：LoC 不包含**注释**

## 优化总结

1. 计算器

   其中计算器代码量没有明显减少是因为在优化过程中，添加了更多的**异常处理**和**精度处理**，如 0/0 和 0.1 + 0.2 的问题，尽管还是使用较为不安全的 eval 函数，但是尽可能地将异常都考虑到了，代码可读性也增强了
   其中助教提到的按钮效果：点击按钮靠顶部时，按钮有动画，但是内容未插入到输入中，是因为 transform 属性中 scale 数值较小，点击边缘的时候触发了 css active 事件，但是 click 事件稍微慢一些没有触发，将 scale 改成 1.01 后即可。其中 HTML 去除了 onclick 属性。

2. 迷宫

   结合 jquery 的**选择器**与**事件**，能减少一些代码量，由于我之前用的是 **ES6** 中的 Array 数组迭代，实际上遍历功能与 jquery 和 lodash 所支持的相差无几

3. 打地鼠

   通过 jquery 的**选择器**和 lodash **遍历**与**随机数**生成，将之前思路较为乱的 js 重写了一遍，代码行数显著减少

4. 拼图游戏

   通过使用 jquery 的**选择器**，lodash 的**随机数**、 isEqual 函数和 ES6 的 Array 数组，能将代码行数减少许多

## 心得

现如今的 ES6 实际上已经能实现 lodash 库中大部分的函数，尤其在遍历和数组操作上，甚至对象等等。但是 ES6 结合 jquery 还是能省下不少**选择**和**设置**上的麻烦

## 题目二 Table Sorter

由于很难找到同时带有 jquery 和 lodash 库的网站，于是可以尝试对带有 jquery 库的网站进行引入已集成好的 tablesorter 库进行排序。

测试网站如下:

### 12306

(1)[12306 广州-西安](https://kyfw.12306.cn/otn/leftTicket/init?linktypeid=dc&fs=%E5%B9%BF%E5%B7%9E,GZQ&ts=%E8%A5%BF%E5%AE%89,XAY&date=2020-11-20&flag=N,N,Y)

由于 **12306** 自带 jquery 库，可以直接实现 table sort，通过引入 tablesorter 库可以直接实现 table 排序。注意先引入 cdn 加速的库，等其加载完，再使用 tablesorter 函数，也即**先执行上面一行神秘代码**，之后再特别地选中排序。

```JavaScript
$("body").append('<script src="https://cdnjs.cloudflare.com/ajax/libs/jquery.tablesorter/2.31.3/js/jquery.tablesorter.min.js" defer></script>');
```

```JavaScript
$(function () {
    $(".t-list table").tablesorter();
});
```

### runoob

(2)[runoob HTML reference1](https://www.runoob.com/tags/html-reference.html)

同样地，由于 **runoob** 网站也有 jquery 库，先引入 cdn 加速过的 tablesorter 库，但是由于 runoob 网站的 table 无 thead 标签，需要先引入之后再进行 tablesorter

```JavaScript
$("body").append('<script src="https://cdnjs.cloudflare.com/ajax/libs/jquery.tablesorter/2.31.3/js/jquery.tablesorter.min.js" defer></script>');
```

```JavaScript
$("body").append('<script src="https://cdnjs.cloudflare.com/ajax/libs/jquery.tablesorter/2.31.3/js/jquery.tablesorter.min.js" defer></script>');
$(".reference").prepend("<thead>");
$(".reference thead").prepend($(".reference tr:first")[0].outerHTML);
$(".reference tbody tr:first").remove();
$(function () {
    $(".reference").tablesorter();
});
```

(3)[runoob jquery selectors](https://www.runoob.com/jquery/jquery-ref-selectors.html)

**runoob** 上 jquery 教程的 table 也同理，使用上面的代码也能进行 table sort

(4)[runoob css table](https://www.runoob.com/css/css-table.html)

**runoob** 上的 css 教程这个表格也是用上方的代码实现排序，并且由于表格元素全是英文，可以明显看出排序的效果

### gaokao

(5)[gaokao sysu](http://college.gaokao.com/school/29/)

**高考网**由于也自带了 jquery 库，所以可以简单地引入 tablesorter 库，修改 table，添加 thead 标签后进行排序

```JavaScript
$("body").append('<script src="https://cdnjs.cloudflare.com/ajax/libs/jquery.tablesorter/2.31.3/js/jquery.tablesorter.min.js" defer></script>');
```

```JavaScript
$("#pointbyarea table").prepend("<thead>");
$("#pointbyarea table thead").prepend($("#pointbyarea tr:first")[0].outerHTML);
$("#pointbyarea table tbody tr:first").remove();
$(function () {
    $("#pointbyarea table").tablesorter();
});
```
