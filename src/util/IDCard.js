import jsonp from 'jsonp'
// import Vue from 'vue'
// import VueJsonp from 'vue-jsonp'

// Vue.use(VueJsonp) 
// http://localhost:8080/api/ReadMsg
// http://192.168.2.102:8080/api/ReadMsg

export default {
    read: function(callback) {
        jsonp('http://localhost:8080/api/ReadMsg', {timeout: 5000}, (err, data) => {
            if (err) {
                console.error('错了错了=',err.message);
            } else {
                callback(data);
                console.log('成功了：',data);
            }
        });
        // Vue.jsonp('http://192.168.2.101:8080/api/ReadMsg').then(json => {
        //     console.log('json==',json);
        //     callback(json);
        //     }).catch(err => {
        //     console.log(err)
        //     })
    }
    
}