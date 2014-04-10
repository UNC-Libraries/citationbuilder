
({
    appDir: "src",
    baseUrl: "js",
    dir: "build",
    
    shim: {
        'jquery-ui': {
            deps: ['jquery']
        }
    },
        
    map: {
        '*': { 'jquery': 'jquery-private' },
        'jquery-private': { 'jquery': 'jquery' }
    },

    modules: [
        {
            name: 'main'
        },
        {
            name: 'opencite'
        }
    ]
})
