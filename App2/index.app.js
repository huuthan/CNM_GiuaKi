// var table=$('#tableDH').DataTable({
//     'paging': true,
//     'lengthChange': true,
//     'searching': false,
//     'ordering': true,
//     'info': true,
//     'autoWidth': true,
//     'language': {
//         "lengthMenu": "Hiển thị _MENU_ dòng",
//         "info": "Đang hiển thị _START_ tới _END_ tổng số _TOTAL_ kết quả",
//         "paginate": {
//             "first": "Trang đầu",
//             "last": "Trang cuối",
//             "next": "Tiếp",
//             "previous": "Trước"
//         }
//     }
// });
var vm = new Vue({
    el: '#container',
    data: {
        userName: '',
        password:'',
        loginVisible:true,
        requestsVisible:false,
        requests: [],
        token:"",
        refToken:""
    },
    methods: {
        login: function() {
            var self = this;
            axios.post('http://localhost:3000/app2/login', {
                userName: self.userName,
                password: self.password,
            })
                .then(function (response) {

                    self.token=response.data.access_token;
                    self.refToken=response.data.refresh_token;
                })
                .catch(function (error) {
                    alert(error);
                }).then(function () {
                    self.getAllRequest();
            })

        },
        getAllRequest:function(){
            var self = this;
            axios.get('http://localhost:3000/api/request/getAll',{ headers: { token: self.token } })
                .then(function (response) {
                    self.requests=response.data;
                    self.requestsVisible=true;
                    self.loginVisible=false;
                    $('#tableDH').DataTable().destroy();
                })
                .catch(function (error) {
                    if (error.response.status===401){
                        self.refreshToken();
                        return;
                    }

                }).then(function () {

                $('#tableDH').DataTable();
            });
        },
        refreshToken:function () {
            var self = this;
            console.log("ref");
            axios.post('http://localhost:3000/api/users/refreshToken', {
                refToken: self.refToken,
            })
                .then(function (response) {
                    self.token=response.data.access_token;
                    self.getAllRequest();
                })
                .catch(function (error) {
                    if (error.response.status===401){
                        self.loginVisible=true;
                        self.requestsVisible=false;
                    }
                }).then(function () {

            })
        }
    }

});


