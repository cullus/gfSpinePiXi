function Atlas(){};

Atlas.prototype = {
    data : null,
    getData : function(url, fun){
        var s = this;
        this.callback = fun;
        var xhr = new XMLHttpRequest();
        xhr.open("GET", url, true);
        xhr.responseType = "text";
        xhr.onload = function(e, n=s){
            if(this.status==200 || this.status==0){
                var data = this.responseText;
                if(data){
                    n.data = data;
                    n.callback("atlas");
                }
            }
        }
        xhr.send();
    }
}