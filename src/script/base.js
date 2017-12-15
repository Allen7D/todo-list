;(function () {
    'use strict';

    var $form_add_task = $('.task-add'),
        $task_delete_trigger = $('.action.delete'),
        $task_detail_trigger = $('.action.detail'),
        $task_detail_mask = $('.task-detail-mask'),//遮罩div
        $task_detail = $('.task-detail'),//详情div
        $form_update,
        current_index,//current_index是全局唯一的
        $task_detail_content,
        $task_detail_content_input,
        task_list = []
        ;


    init();
    // 监听submit(全局公用)
    $form_add_task.on('submit', on_add_task_form_submit);
    // 监听mask(全局公用)
    $task_detail_mask.on('click', hide_task_detail);

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

    function listen_task_detail() {
        $('.task-item').on('dblclick', function () {
            let index =  $(this).data('index');
            show_task_detail(index);
        })

        $task_detail_trigger.on('click', function () {
            let $this = $(this);
            let $item = $this.parent().parent();
            let index = $item.data('index');

            show_task_detail(index);

        })
    }

    function update_task(index, data) {
        if (!index || !task_list[index]) return;

        task_list[index] = data;
        refresh_task_list();//全部渲染一遍

    }

    function show_task_detail(index) {
        render_task_detail(index);//渲染(隐藏版task_detail)
        current_index = index; //在查看时，可以修改，用于指定保存

        $task_detail.show();//显示
        $task_detail_mask.show();
    }

    function hide_task_detail() {
        $task_detail.hide();
        $task_detail_mask.hide();
    }

    //渲染指定task的详细信息
    function render_task_detail(index) {
        if (index === undefined || !task_list[index]) return;

        let item = task_list[index];
        let tpl =
            '<form>' +
                '<div class="content">' + item.content + '</div>' +
                '<div>' +
                    '<div class="input-item">' +
                        '<input style="display: none" type="text" name="content" value="' + (item.content || "") + '">' +
                    '</div>' +
                    '<div class="decs input-item">' +
                        '<textarea name="desc">' + (item.desc || "") + '</textarea>' +
                    '</div>' +
                '</div>' +
                '<div class="remind input-item">' +
                    '<input name="remind_date" type="date" value="' + (item.remind_date || "") + '">' +
                '</div>' +
                '<div class="input-item">' +
                    '<button type="submit">更新</button>' +
                '</div>' +
            '</form>';

        $task_detail.html(null);
        $task_detail.html(tpl);
        $form_update = $task_detail.find('form');
        //点击提交
        $form_update.on('submit', function (e) {
            e.preventDefault();
            let data = {};
            data.content = $(this).find('[name=content]').val();
            data.desc = $(this).find('[name=desc]').val();
            data.remind_date = $(this).find('[name=remind_date]').val();
            update_task(index, data);
        })

        $task_detail_content = $form_update.find('.content');
        $task_detail_content_input = $form_update.find('[name=content]');
        //双击显示
        $task_detail_content.on('dblclick', function () {
            $task_detail_content_input.show();
            $task_detail_content.hide();
        })
    }

    //查找并监听所有删除按钮的点击事件
    function listen_task_delete() {
        //每一个「delete task」都有各自的监听
        $task_delete_trigger.on('click', function () {
            var $this = $(this);
            var $item = $this.parent().parent(); //选中上上层父级元素，即删除按钮所在的task，范围更大
            var index = $item.data('index');
            var tmp = confirm('确定删除！');

            tmp ? delete_task(index):null;//用户的if操作
        })
    }


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

    //刷新「删除or添加」后的task_list
    function refresh_task_list() {
        store.set('task_list', task_list);
        render_task_list();
    }

    //用于init和refresh
    function render_task_list() {
        var $task_list = $('.task-list');
        $task_list.html('');//清空
        //重新渲染
        for(var i = 0; i < task_list.length; i++){
            var $task = render_task_item(task_list[i], i);
            $task_list.prepend($task);
        }

        $task_delete_trigger = $('.action.delete');//多个平行属性,找到所有的。
        $task_detail_trigger = $('.action.detail');
        //每次render,监听重建一次。
        listen_task_delete();
        listen_task_detail();
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
