var $$ = Dom7;

var user_data;
var group_id;

var app = new Framework7({
    root: '#app',
    name: 'Challenges',
    theme: 'auto',
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
                    app.request.get('http://ec2-18-217-233-76.us-east-2.compute.amazonaws.com/challenge/list', {
                        group_id: group_id,
                    }, function (data) {
                        var _data = JSON.parse(data);
                        console.log(_data);
                        var _list = page.app.virtualList.create({
                            el: '.virtual-list2',
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
                            '<a href="#" class="item-link item-content" onclick="openChat()">' +
                            '<div class="item-inner">' +
                            '<div class="item-title-row">' +
                            '<div class="item-title">{{title}}</div>' +
                            '</div>' +
                            '</div>' +
                            '</a>' +
                            '</li>',
                            height: app.theme === 'ios' ? 63 : 73,
                        })
                    });
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
        {
            path: '/messages/',
            url: './pages/messages.html',
            on: {
                pageInit: function (e, page) {
                    var messages = app.messages.create({
                        el: '.messages',

                        // First message rule
                        firstMessageRule: function (message, previousMessage, nextMessage) {
                            // Skip if title
                            if (message.isTitle) return false;
                            /* if:
                              - there is no previous message
                              - or previous message type (send/received) is different
                              - or previous message sender name is different
                            */
                            if (!previousMessage || previousMessage.type !== message.type || previousMessage.name !== message.name) return true;
                            return false;
                        },
                        // Last message rule
                        lastMessageRule: function (message, previousMessage, nextMessage) {
                            // Skip if title
                            if (message.isTitle) return false;
                            /* if:
                              - there is no next message
                              - or next message type (send/received) is different
                              - or next message sender name is different
                            */
                            if (!nextMessage || nextMessage.type !== message.type || nextMessage.name !== message.name) return true;
                            return false;
                        },
                        // Last message rule
                        tailMessageRule: function (message, previousMessage, nextMessage) {
                            // Skip if title
                            if (message.isTitle) return false;
                            /* if (bascially same as lastMessageRule):
                            - there is no next message
                            - or next message type (send/received) is different
                            - or next message sender name is different
                          */
                            if (!nextMessage || nextMessage.type !== message.type || nextMessage.name !== message.name) return true;
                            return false;
                        }
                    });

                    var messagebar = app.messagebar.create({
                        el: '.messagebar',
                        attachments: []
                    });

                    var responseInProgress = false;

                    $$('.send-link').on('click', function () {
                        var text = messagebar.getValue().replace(/\n/g, '<br>').trim();
                        // return if empty message
                        if (!text.length) return;

                        // Clear area
                        messagebar.clear();

                        // Return focus to area
                        messagebar.focus();

                        // Add message to messages
                        messages.addMessage({
                            text: text,
                        });

                        if (responseInProgress) return;
                        // Receive dummy message
                        receiveMessage();
                    });

                    var answers = [
                        'Да!',
                        'Нет',
                        'Хм...',
                        'Я не знаю',
                        'Че думаешь?',
                        'May be ;)',
                        'Сам такой',
                        'Че?',
                        'Ты уверен?',
                        'Хорошо'
                    ];
                    var people = [
                        {
                            name: 'Kate Johnson',
                            avatar: 'http://lorempixel.com/100/100/people/9'
                        },
                        {
                            name: 'Blue Ninja',
                            avatar: 'http://lorempixel.com/100/100/people/7'
                        }
                    ];

                    function receiveMessage() {
                        responseInProgress = true;
                        setTimeout(function () {
                            // Get random answer and random person
                            var answer = answers[Math.floor(Math.random() * answers.length)];
                            var person = people[Math.floor(Math.random() * people.length)];

                            // Show typing indicator
                            messages.showTyping({
                                header: person.name + ' is typing',
                                avatar: person.avatar
                            });

                            setTimeout(function () {
                                // Add received dummy message
                                messages.addMessage({
                                    text: answer,
                                    type: 'received',
                                    name: person.name,
                                    avatar: person.avatar
                                });
                                // Hide typing indicator
                                messages.hideTyping();
                                responseInProgress = false;
                            }, 4000);
                        }, 1000);
                    }
                }
            },
        },
        {
            path: '/user/',
            url: './pages/user.html',
            on: {
                pageInit: function (e, page) {
                var formData = {
                            'name': user_data.user_name,
                            'email': user_data.user_email,
                            'gender': user_data.user_gender
                        };
                        app.form.fillFromData('#my-form', formData);
//                    $$('.convert-form-to-data').on('click', function () {
//                        var formData = app.form.convertToData('#my-form');
//                        alert(JSON.stringify(formData));
//                    });
                },
            }
        },
        {
            path: '/friends/',
            url: './pages/friends.html',
            on: {
                pageInit: function (e, page) {
                    app.request.get('http://ec2-18-217-233-76.us-east-2.compute.amazonaws.com/user/list', {
                        group_id: group_id,
                    }, function (data) {
                        var _data = JSON.parse(data);
                        console.log(_data);
                        var _list = page.app.virtualList.create({
                            el: '.virtual-list3',
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
                            '<div class="item-inner">' +
                            '<div class="item-title-row">' +
                            '<div class="item-title">{{nick}}</div>' +
                            '</div>' +
                            '</div>' +
                            '</li>',
                            height: app.theme === 'ios' ? 63 : 73,
                        })
                    });
                }
            }
        },
        {
            path: '/add-challenge/',
            url: './pages/add-challenge.html',
            on: {
                pageInit: function (e, page) {

                },
            }
        }
    ],
});

function choseGroup(id) {
    group_id = id;
    app.router.navigate('/group-node/');
}

function sendChallenge() {
    app.request.post('http://ec2-18-217-233-76.us-east-2.compute.amazonaws.com/challenge', {
        description: $$('#_challengeDescription').val(),
        title: $$('#_challengeTitle').val(),
        group_id: group_id,
        author_id: user_data.user_id,
        assignee_id: user_data.user_id,
    }, function (data) {
        app.dialog.alert("Challenge has been created.");
        app.router.navigate('/group-node/');
    })
}

function openChat() {
    app.router.navigate('/messages/');
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
