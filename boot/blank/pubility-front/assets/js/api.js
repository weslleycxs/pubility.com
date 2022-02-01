var Api = {

    host: 'https://pubility.com/api/v1/',

    blockRequest: false,

    get: function(url, obj){

        console.log(`Api.get`, url);

        return Api.default(url, 'get', obj);

    },

    post: function(url, obj){

        console.log(`Api.post`, url);

        return Api.default(url, 'post', obj);

    },

    request: function(url, method, obj){

        var headers = {};

        var jwt = localStorage.getItem('_jwt');

        if(jwt) headers['x-access-token'] = jwt;

        var ajaxObj = {

            url: Api.host + url,
            type: method,
            data: obj,
            headers: headers

        }

        return $.ajax(ajaxObj);

    },

    default: function(url, method, obj){

        if(Api.blockRequest) return Promise.resolve({success: false, message: 'blocked'});

        // Define um callback de erro padrão
        var onerror = function(res){

            // Caso contrário, vamos notificar o erro
            Alerts.notify(res.error);

            return Promise.reject();

        }

        // Substitui o callback de erros, caso tenha sido passado
        if(obj.onerror) onerror = obj.onerror;

        // Caso exista botão, prossegue, caso não tenha, botão é nulo
        var btn = obj._btn || null;
        var loading;

        // Isso guarda se caímos na requisição bem sucedida ou se deu erro antes
        var handled = false;

        // Importante remover do payload para que não vá junto na requisição
        delete obj._btn;

        // Se possuir algum botão de carregamento
        if(btn){

            // Se já está carregando, esse botão impede que uma nova requisição seja feita
            if(Helpers.isLoading(btn)) return Promise.reject('already-sent');

            // Associa o botão de carregamento ao loading
            loading = Helpers.loading(btn);
        }

        // Impede que esse objeto vá para a requisição
        delete obj.onerror;

        return Api.request(url, method, obj).then(function(res){

            if(typeof res.success !== 'undefined'){

                res.status = res.success?'success':'error';

                if(res.success){

                    res.data = res.message;

                } else{

                    res.error = res.message;

                }

            }

            if(loading) loading.reset();

            handled = true;

            // Caso possua res.status
            if(typeof res.status !== 'undefined'){


                // Caso tenha dado algum erro no backend
                if(res.status == 'error'){

                    return onerror(res);

                }

                // Se tiver sido bem sucedido, vamos retornar o dado
                return res.data;

            }

            // No caso de não ter .status, vamos só retornar
            return res;

        }).catch(function(error){

            if(!handled){

                Alerts.notify('Ocorreu um erro inesperado<br>Tente novamente em minutos', 10000);

                if(loading) loading.reset();

            }

            return Promise.reject(error);

        });

    }

}

