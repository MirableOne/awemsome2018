// Dom7
var $$ = Dom7;

var user_data;

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
                {
            path: '/messages/',
            url: './pages/messages.html',
            on: {
                            pageInit: function (e, page) {
// Init Messages
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

// Init Messagebar
var messagebar = app.messagebar.create({
  el: '.messagebar',
  attachments: []
});

// Response flag
var responseInProgress = false;

// Send Message
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

// Dummy response
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
]
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
