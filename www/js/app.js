// Dom7
var $$ = Dom7;

var user_data;

// Framework7 App main instance
var app = new Framework7({
    root: '#app', // App root element
    id: 'io.framework7.testapp', // App bundle ID
    name: 'Framework7', // App name
    theme: 'auto', // Automatic theme detection
    // App root data
    data: function () {
        return {
            user: {
                firstName: 'John',
                lastName: 'Doe',
            },
            // Demo products for Catalog section
            products: [
                {
                    id: '1',
                    title: 'Apple iPhone 8',
                    description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Nisi tempora similique reiciendis, error nesciunt vero, blanditiis pariatur dolor, minima sed sapiente rerum, dolorem corrupti hic modi praesentium unde saepe perspiciatis.'
                },
                {
                    id: '2',
                    title: 'Apple iPhone 8 Plus',
                    description: 'Velit odit autem modi saepe ratione totam minus, aperiam, labore quia provident temporibus quasi est ut aliquid blanditiis beatae suscipit odio vel! Nostrum porro sunt sint eveniet maiores, dolorem itaque!'
                },
                {
                    id: '3',
                    title: 'Apple iPhone X',
                    description: 'Expedita sequi perferendis quod illum pariatur aliquam, alias laboriosam! Vero blanditiis placeat, mollitia necessitatibus reprehenderit. Labore dolores amet quos, accusamus earum asperiores officiis assumenda optio architecto quia neque, quae eum.'
                },
            ]
        };
    },
    // App root methods
    methods: {
        helloWorld: function () {
            app.dialog.alert('Hello World!');
        },
    },
    // App routes
    routes: [
        {
            path: '/',
            url: './index.html',
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
                                '<a href="#" class="item-link item-content">' +
                                    '<div class="item-inner">' +
                                        '<div class="item-title-row">' +
                                            '<div class="item-title">{{group_name}}</div>' +
                                        '</div>' +
                                        '<div class="item-subtitle">{{group_name}}</div>' +
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
