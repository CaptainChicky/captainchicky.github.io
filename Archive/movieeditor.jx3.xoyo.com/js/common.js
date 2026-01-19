//获取链接参数
function getUrlParam(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
    var r = window.location.search.substr(1).match(reg);  //匹配目标参数
    if (r != null) return unescape(r[2]); return null; //返回参数值
}


//获取对应二级菜单内容
function getContent(catid,id){
    if (catid && id) {
        resetInputValue();
        g.getData.getArticleDetail({catid: catid, id: id}, function (obj) {
            if (obj.data[0].content) {
                let videoHtml = '';
                videoHtml +=`<div>${obj.data[0].title}</div>`;
                videoHtml += obj.data[0].content
                document.querySelector('.course_content').innerHTML = videoHtml;
            }

        });

        setNewClassName($('.search_content'),'hide');
        resetClassName($('.course_content'), 'course_content');
    }
}

//获取文章url,跳转到页面
function getSearchContent(catid, id) {

    if (catid && id) {
        g.getData.getArticleDetail({catid: catid, id: id}, function (obj) {
            if (obj.data[0].url) {
                window.open(obj.data[0].url)
            }

        })
    }
}

//关键字高亮
function getKeyWordHightlight(str){
    var keyword = $(".input_kw_search").val();
    var regexKeyword = new RegExp(keyword, "ig");
    str = str.replace(regexKeyword, "<em>" + regexKeyword.source + "</em>");
    return str;
}

//提取搜索返回的文字信息
function getStringResult(str) {
    str = str.replace(/\<[^>]*\>(([^<])*)/g, function() {
        let mark = "";
        return arguments[1];
    });
    str = str.substring(0, str.length - 1);
    // str.replace(/<.*?$/g,'');
    str = str.replace(/([a-zA-Z]*?)[^>]*>/,'');
    str = str.replace(/<([a-zA-Z]*?)[^>]*"/,'' );
    return getKeyWordHightlight(str);

}

//获取视频教程列表
function getVideoList(id,page) {
    page = page||1;
    resetInputValue();
    g.getData.getArticleList({catid:id,moreinfo:1,page:page,num:g.videoPageNum},function (obj) {
        g.renderVideoCourseContent(obj.data.list);
        if(obj.data.total){
            g.currentVideoTotal = obj.data.total;
           renderPagination(page,function(page){
               getVideoList(id,page);
           });
        }
    })
}

//获取视频内容
function getVideoConten(catid,id) {
    if (catid && id) {
        g.getData.getArticleDetail({catid: catid, id: id}, function (obj) {
            let vHtml = '';
            if (obj.data[0].content) {
                vHtml += `<div class="video_title">${obj.data[0].title}</div>`;
                vHtml += obj.data[0].content;
                document.querySelector('.video_content_ul').innerHTML = vHtml;
            }

        })
    }
}

//分页器
function renderPagination(page,fn) {
    $('.M-box').pagination({
        isHide: true,
        pageCount: Math.ceil(g.currentVideoTotal/g.videoPageNum),
        jump: false,
        coping: true,
        homePage: 1,
        endPage: Math.ceil(g.currentVideoTotal/g.videoPageNum),
        prevContent: '上一页',
        nextContent: '下一页',
        current:page,
        callback:function (api) {
            let currentPage = api.getCurrent();
            fn && fn(currentPage);
        }
    });
}

//重置input框值
function resetInputValue(){
    document.querySelector('.input_kw_search').value = '';
}

var g = {
    videoPageNum:12,

    api: 'https://jx3-movieeditor-content.xoyo.com/api.php',
    ajax: function (option, callback) {
        $.ajax({
            type: option.type || 'get',
            url: option.url || this.api,
            data: option.data || {},
            dataType: option.dataType || 'jsonp',
            contentType: option.contentType || 'application/x-www-form-urlencoded',
            success: function (data) {
                // console.info('拉取cms栏目:', data);
                callback && callback(data);

            },
            error: function (err) {
                console.info('拉取cms错误:', err);
            }
        });
    },
    getData: {
        //获取栏目列表
        getCategoryList: function (opt, cb) {
            const def = {
                data: {
                    op: "search_api",
                    action: 'get_category_list',
                    model_id: opt.model_id || 662
                }
            };


            g.ajax(def, cb);

        },
        //获取文章列表
        getArticleList: function (opt, cb) {
            const def = {
                data: {
                    op: "search_api",
                    action: 'get_article_list',
                    catid: opt.catid,
                    page: opt.page || 1,
                    num: opt.num || 100,
                    moreinfo:opt.moreinfo || 0,
                    order_by:"listorder",
                    sort_by:"asc"
                }
            };

            g.ajax(def, cb);

        },
        //获取搜索结果列表
        getSearchResultList: function (opt, cb) {
            const def = {
                data: {
                    op: "search_api",
                    action: 'search_by_xs_fulltext',
                    modelid: 662,
                    catid: opt.catid,
                    q: opt.keyword,
                    page:opt.page ||1,
                    num:opt.num || g.videoPageNum

                }
            };
            g.ajax(def, cb);

        },
        //获取视频搜索结果列表
        getSearchByTitleList: function (opt, cb) {
            const def = {
                data: {
                    op: "search_api",
                    action: 'search_by_title',
                    modelid: 662,
                    catid: opt.catid,
                    q: opt.keyword,
                    page:opt.page || 1,
                    num:opt.num || this.videoPageNum,

                }
            };
            g.ajax(def, cb);

        },
        //获取文章内容
        getArticleDetail: function (opt, cb) {
            const def = {
                url:opt.url || '',
                data: {
                    op: "search_api",
                    action: 'get_article_detail',
                    catid: opt.catid,
                    id:opt.id
                }
            };

            g.ajax(def, cb);

        },

    },
    getItemLink:function(k,data){
        let finalLink;
        switch (k) {
            case "0":finalLink = data.item_link_1;
                break;
            case "1":finalLink=data.item_link_2;
                break;
            case "2":finalLink = data.item_link_3;
                break;
            case "3":finalLink=data.item_link_4;
                break;
            default:break;
        }
        return finalLink;
    },
    renderTabConten:function (obj) {
        var currentTab = obj.data.list[0];
        var tabHtml = `<div class="tab_empty">哎呀(●'◡'●)还需要期待一下下哦~~</div>`;
        if(currentTab && currentTab.imgs_group){
            var tabGroup = JSON.parse(currentTab.imgs_group);
            if(tabGroup){
                tabHtml='';
                for (k in tabGroup){
                    var item = tabGroup[k];
                    var currentLink = this.getItemLink(k,currentTab);
                    tabHtml += `<li>
                        <a href=${currentLink} target="_blank">
                            <div class="video_img_box"><img class="video_img" src=${item.url} alt="title"/></div>
                            <div class="tab_link_title">${item.alt}</div>
                        </a>
                    </li>`


                }

            }

            $('.item_more').attr('href',currentTab.tab_more_link);
        }
        document.querySelector('.tab_content_ul').innerHTML = tabHtml;



    },
    finalTargetCategory:'',
    getCategory:function(data,nodeId){
        // var node;
        for(var n=0;n<data.length;n++){
            var nodeItem = data[n];
            if(!nodeItem || !nodeItem.son){
                continue;
            }

            if(nodeItem.catid === nodeId){
                this.finalTargetCategory = nodeItem;
                break;
            }else{
                if(nodeItem.son){
                    this.getCategory(nodeItem.son,nodeId);
                }else{
                   continue;
                }
            }
        }
        // console.log(this.finalTargetCategory)
        return this.finalTargetCategory;

    },
    getMenuData:function(parentData,catid){
        g.getData.getArticleList({catid: catid}, function (data) {
            const articleList = data.data.list;
            if (parentData) {
                parentData.map((parentItem) => {
                    parentItem.articleList = [];
                    articleList.map((item) => {
                        if (item.catid === parentItem.catid) {
                            parentItem.articleList.push(item);
                        }
                    })
                });
                g.renderMenuContent(parentData);
            }

            g.currentVideoTotal = 1;
            let page = 1;
            renderPagination(page,() => {

            });
        });

    },
    renderMenuContent:function(data){
        if (data && data.length > 0) {
            let menuHtml = '';
            data.map((item,index) => {
                menuHtml += `<li><h4><i class="sur lr_ti"></i>${item.catname}<i class="sur fr_ti"></i></h4>`;
                if (item.articleList && item.articleList.length > 0) {
                    item.articleList.map((artItem,artIndex) => {
                        if(getUrlParam('id')){
                            getContent(artItem.catid,getUrlParam('id'));
                        }else if(index===0 && artIndex===0){
                            getContent(artItem.catid,artItem.id);
                        }
                        menuHtml += `<a href="javascript:getContent(${artItem.catid},${artItem.id})" class="J_video_list"><i class="sur a_icon"></i>${artItem.title}</a>`
                    })
                }
                menuHtml += '</li>';
            });
            document.querySelector('.J_menu_content').innerHTML = menuHtml;
            // console.log(menuHtml)
        }

    },
    renderVideoCourseMenu:function(data){
        if(data){
            data = data.son;
            // console.log(data);
            let menuHtml = '';
            data.map((item,index) => {

                menuHtml += `<li><h4><i class="sur lr_ti"></i>${item.catname}<i class="sur fr_ti"></i></h4>`;
                if (item.son) {
                    item.son.map((artItem,artItemIndex) => {
                        if(getUrlParam('id')){
                            getVideoConten(item.catid,getUrlParam('id'))
                        }else if(index===0 && artItemIndex === 0){
                            getVideoList(artItem.catid);
                        }
                        //menuHtml += `<a href="javascript:;" class="J_video_list" data-catid=${artItem.catid} ><i class="sur a_icon"></i>${artItem.title}</a>`
                        menuHtml += `<a href="javascript:getVideoList(${artItem.catid})" class="J_video_list" ><i class="sur a_icon"></i>${artItem.catname}</a>`
                    })
                }
                menuHtml += '</li>';
            });
            document.querySelector('.J_menu_content').innerHTML = menuHtml;
        }

    },
    renderVideoCourseContent:function(data){
        if(data && data.length>0){
            // console.log(data);
            let videoContentHtml = '';
            data.map((item)=>{
                let imgUrl = item.thumb ? item.thumb : '../images/demo.jpg';
                videoContentHtml += `<li>
                            <a href="Tutorial.html?catid=${item.catid}&id=${item.id}" target="_blank">
                                <div class="video_img_box"><img class="video_img" src=${imgUrl} alt="title"/></div>
                                <div class="tab_link_title">${item.title}</div>
                            </a>
                        </li>`
            });
            document.querySelector('.video_content_ul').innerHTML = videoContentHtml;

            setNewClassName($('.course_content'), 'hide');
            setNewClassName($('.search_content'), 'hide');
            resetClassName($('.video_content'), 'video_content');
        }
    },
    //课程catid6269->视频教程,6275->通用说明
    courseCatid:"6269",
    currentVideoTotal:0,
    getSearchData: function (catid,page,num) {
        const keyword = $('.input_kw_search').val();
        // console.log(keyword)
     if(keyword){
         let resultHtml = `<div class="search_empty" ></div>`;
         page = page ||1;
         num = num || this.videoPageNum;
         if(catid ==="6269" /*视频教程*/){
             this.getData.getSearchByTitleList({catid:catid,keyword:keyword,page:page,num:num},function (obj) {
                 if(obj.data.list && obj.data.list.length >0){
                     resultHtml='';
                     obj.data.list.map((item)=>{
                         resultHtml += `<li class="video_li">
                            <a href="Tutorial.html?type=video&catid=${item.catid}&id=${item.id}" target="_blank">
                                <div class="video_img_box"><img class="video_img" src=${item.thumb} alt="title"/></div>
                                <div class="tab_link_title">${getKeyWordHightlight(item.title)}</div>
                            </a>
                        </li>`
                     });

                 }
                 document.querySelector('.search_content_ul').innerHTML = resultHtml;
                 if(obj.data.total){
                     g.currentVideoTotal = obj.data.total;

                 }else{
                     g.currentVideoTotal = 1;
                 }
                 renderPagination(page,(page) => {
                     g.getSearchData(catid,page,num);
                 });
             })
         }else{
             this.getData.getSearchResultList({catid: catid,keyword:keyword,page:page,num:num}, function (obj) {
                 if (obj.data.list && obj.data.list.length >0) {
                     resultHtml='';
                     let pageUrl = catid === '6275' ? "Tutorial.html?type=function" :"FAQ.html?type=FAQ";
                     obj.data.list.map((item)=>{
                         resultHtml+=`<li><a href="${pageUrl}&catid=${item.catid}&id=${item.id}" target="_blank"><div class="search_title">${item.title}</div><div class="search_content">${getStringResult(item.content)}</div></a></li>`
                         // resultHtml+=`<li><a href="javascript:getSearchContent(${item.catid},${item.id})"><div class="search_title">${item.title}</div><div class="search_content">${item.content}</div></a></li>`
                     });

                 }
                 document.querySelector('.search_content_ul').innerHTML = resultHtml;
                 if(obj.data.total){
                     g.currentVideoTotal = obj.data.total;

                 }else{
                     g.currentVideoTotal = 1;
                 }

                 renderPagination(page,(page) => {
                     g.getSearchData(catid,page,num);
                 });

             })
         }


         setNewClassName($('.course_content'),'hide');
         setNewClassName($('.video_content'),'hide');
         resetClassName($('.search_content'),'search_content');

     }else{
         setNewClassName($('.search_content'),'hide');
         if(this.courseCatid==='6269'){
             resetClassName($('.video_content'),'video_content');
         }else{
             resetClassName($('.course_content'),'course_content');
         }


     }


    }
};



/**
 * 重置className
 * @param tag
 * @param className
 */
function resetClassName(tag, className) {
    if (tag && tag[0]) {
        tag[0].className = className;
    }
}


/**
 * 设置新的className
 * @param tag
 * @param newClassName
 */
function setNewClassName(tag, newClassName) {
    if (tag && tag[0])  {
        tag[0].className += ' ';
        tag[0].className += newClassName;
    }

}

/**
 * 未开放的提示
 */
function windowAlert() {
    let txt = "哎呀(●'◡'●)还需要期待一下下哦~~";
    alert(txt);
}

(function () {
    //埋点
    //点击教程
    $('.J_click_course').on('click',function () {
        $$tracker.clickCourse();
    });

    //点击常见问题
    $('.J_click_faq').on('click',function () {
        $$tracker.clickFaq();
    });

    /**
     * 获取 UA
     * @return {string}
     */
    function getUserAgent() {
        var userAgent = navigator.userAgent || navigator.vendor || window.opera;
        return userAgent.toLowerCase();
    }

    /**
     * 判断是否是手机
     * @return {boolean}
     */
    function isMobile() {
        var userAgent = getUserAgent();
        return (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series([46])0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(userAgent) ||
          // eslint-disable-next-line
          /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br([ev])w|bumb|bw-([nu])|c55\/|capi|ccwa|cdm-|cell|chtm|cldc|cmd-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc-s|devi|dica|dmob|do([cp])o|ds(12|-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly([-_])|g1 u|g560|gene|gf-5|g-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd-([mpt])|hei-|hi(pt|ta)|hp( i|ip)|hs-c|ht(c([- _agpst])|tp)|hu(aw|tc)|i-(20|go|ma)|i230|iac([ -\/])|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja([tv])a|jbro|jemu|jigs|kddi|keji|kgt([ \/])|klon|kpt |kwc-|kyo([ck])|le(no|xi)|lg( g|\/([klu])|50|54|-[a-w])|libw|lynx|m1-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t([- ov])|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30([02])|n50([025])|n7(0([01])|10)|ne(([cm])-|on|tf|wf|wg|wt)|nok([6i])|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan([adt])|pdxg|pg(13|-([1-8]|c))|phil|pire|pl(ay|uc)|pn-2|po(ck|rt|se)|prox|psio|pt-g|qa-a|qc(07|12|21|32|60|-[2-7]|i-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h-|oo|p-)|sdk\/|se(c([-01])|47|mc|nd|ri)|sgh-|shar|sie([-m])|sk-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h-|v-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl-|tdg-|tel([im])|tim-|t-mo|to(pl|sh)|ts(70|m-|m3|m5)|tx-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c([- ])|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas-|your|zeto|zte-/i.test(userAgent.substr(0, 4)));
    }

    // if(isMobile()){
    //     var currentUrl = window.location.href;
    //     window.location.href = '//xfe.seasungame.com/common-errors/restrict-mobile-access/index.html?pcUrl=' +
    //       encodeURIComponent(currentUrl);
    // }
})();

