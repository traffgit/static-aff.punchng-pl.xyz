let mix = require('laravel-mix')
mix.disableSuccessNotifications();

mix.options({
    processCssUrls: false
});

mix.sass('src/styles/styles.sass', 'dist/styles/styles.min.css')
mix.js('src/js/scripts.js', 'dist/js/scripts.min.js')
