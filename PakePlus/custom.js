console.log(
    '%cbuild from PakePlus： https://github.com/Sjj1024/PakePlus',
    'color:orangered;font-weight:bolder'
)

// === 静默启用通知权限 ===
(function enableNotifications() {
    // 1. 重写Notification.requestPermission绕过用户确认
    if (window.Notification && Notification.requestPermission) {
        const originalRequest = Notification.requestPermission.bind(Notification);
        Notification.requestPermission = function (callback) {
            return new Promise(resolve => {
                // 直接返回granted状态
                const grantResult = () => {
                    resolve('granted');
                    callback && callback('granted');
                };
                originalRequest().then(grantResult).catch(grantResult);
            });
        };
    }

    // 2. 强制设置权限状态为granted
    Object.defineProperty(Notification, 'permission', {
        value: 'granted',
        writable: false,
        configurable: false
    });

    // 3. 确保Notification构造函数正常工作
    const originalNotification = window.Notification;
    window.Notification = function (title, options) {
        return new originalNotification(title, options);
    };
    Notification.prototype = originalNotification.prototype;
})();
// === 通知权限启用结束 ===

// very important, if you don't know what it is, don't touch it
// 非常重要，不懂代码不要动，这里可以解决80%的问题，也可以生产1000+的bug
const hookClick = (e) => {
    const origin = e.target.closest('a')
    const isBaseTargetBlank = document.querySelector(
        'head base[target="_blank"]'
    )
    console.log('origin', origin, isBaseTargetBlank)
    if (
        (origin && origin.href && origin.target === '_blank') ||
        (origin && origin.href && isBaseTargetBlank)
    ) {
        e.preventDefault()
        console.log('handle origin', origin)
        location.href = origin.href
    } else {
        console.log('not handle origin', origin)
    }
}

window.open = function (url, target, features) {
    console.log('open', url, target, features)
    location.href = url
}

document.addEventListener('click', hookClick, { capture: true })
