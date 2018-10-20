// Dom7
var $$ = Dom7;

var user_data;
var group_id;
// Framework7 App main instance
var app = new Framework7({
    root: '#app', // App root element
    name: 'Challenges', // App name
    theme: 'auto', // Automatic theme detection
    // App routes
    routes: [
        {
            path: '/',
            url: './index.html',
        },
        {
            path: '/group-node',
            url: './pages/group-node.html',
            on: {
                pageInit: function (e, page) {
                    app.dialog.alert(group_id);
                }
            }
        },
        {
            path: '/groups/',
            url: './pages/groups.html',
            on: {
                pageInit: function (e, page) {
                    app.request.get('http://ec2-18-217-233-76.us-east-2.compute.amazonaws.com/group/list', {
                        user_id: user_data.user_id,
                    }, function (data) {
                        var _data = JSON.parse(data);
                        console.log(_data);
                        var _list = page.app.virtualList.create({
                            el: '.virtual-list',
                            items: _data,
                            searchAll: function (query, items) {
                                var found = [];
                                for (var i = 0; i < items.length; i++) {
                                    if (items[i].group_name.toLowerCase().indexOf(query.toLowerCase()) >= 0 || query.trim() === '') found.push(i);
                                }
                                return found;
                            },
                            itemTemplate:
                            '<li>' +
                                '<a href="#" class="item-link item-content" onclick="choseGroup({{group_id}})">' +
                                    '<div class="item-inner">' +
                                        '<div class="item-title-row">' +
                                            '<div class="item-title">{{group_name}}</div>' +
                                        '</div>' +
                                    '</div>' +
                                '</a>' +
                            '</li>',
                            height: app.theme === 'ios' ? 63 : 73,
                        })
                    });


                },
            }
        },
    ],
});

function choseGroup(id){
    group_id = id;
    app.router.navigate('/group-node/');
}

// Init/Create views
var homeView = app.views.create('#view-home', {
    url: '/'
});
var catalogView = app.views.create('#view-catalog', {
    url: '/catalog/'
});
var settingsView = app.views.create('#view-settings', {
    url: '/settings/'
});

$$('#sign-in__button').on('click', function (event) {
    var user = $$('#sign-in__username').val();
    var pass = $$('#sign-in__password').val();

    app.request.get('http://ec2-18-217-233-76.us-east-2.compute.amazonaws.com/auth', {
        username: user,
        password: pass
    }, function (data) {
        user_data = JSON.parse(data);
        if (user_data.user_id) {
            app.router.navigate('/groups/');
        }
        else {
            app.dialog.alert("The username or password you entered is incorrect");
            return false;
        }
    });
});

$$('._groupSelector').on('click', function (event) {
   alert($$(this).data('index'));
});
