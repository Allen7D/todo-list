;(function () {
    'use strict';

    var $form_add_task = $('.add-task'),
        $delete_task,
        task_list = []
        ;

    init();


    // 监听submit
    $form_add_task.on('submit', on_add_task_form_submit);

    function on_add_task_form_submit(e) {
        var new_task = {},
            $input;

        //禁用默认行为
        e.preventDefault();
        //获取新Task的值
        $input = $(this).find('input[name=content]');
        new_task.content = $input.val()
        if (!new_task.content) return;
        //存入新Task
        if (add_task(new_task)){
            $input.val(null)
        }
    }

    //查找并监听所有删除按钮的点击事件
    function listen_task_delete() {
        //每一个「delete task」都有各自的监听
        $delete_task.on('click', function () {
            var $this = $(this);
            var $item = $this.parent().parent(); //选中上上层父级元素，即删除按钮所在的task，范围更大
            var index = $item.data('index');
            var tmp = confirm('确定删除！');

            tmp ? delete_task(index):null;//用户的if操作
        })
    }


    //自定义函数
    function init() {
        // store.clearAll(); //删除全部
        task_list = store.get('task_list') || [];
        if (task_list.length)
            render_task_list(task_list);
    }

    function delete_task(index) {
        if(index === undefined || !task_list[index]) return;

        delete task_list[index];
        refresh_task_list();
    }

    function add_task(new_task) {
        task_list.push(new_task);
        refresh_task_list();

        return true;
    }

    function refresh_task_list() {
        store.set('task_list', task_list);
        render_task_list();
    }

    function render_task_list() {
        var $task_list = $('.task-list');
        $task_list.html('');//清空
        //重新渲染
        for(var i = 0; i < task_list.length; i++){
            var $task = render_task_item(task_list[i], i);
            $task_list.append($task);
        }

        $delete_task = $('.action.delete')//多个平行属性,找到所有的。
        //每次render,监听重建一次。
        listen_task_delete();
    }

    function render_task_item(data, index) {
        if (!data || index === undefined) return;
        var list_item_tpl =
            '<div class="task-item" data-index="' + index + '">' +
                '<span><input type="checkbox"></span>' +
                '<span class="task-content">' + data.content + '</span>' +
                '<span class="fr">' +
                    '<span class="action delete"> 删除</span>' +
                    '<span class="action detail"> 详细</span>' +
                '</span>' +
            '</div>';

        return $(list_item_tpl);
    }
})();