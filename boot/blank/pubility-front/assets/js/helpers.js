if(self && typeof self.ServiceWorkerGlobalScope !== 'undefined'){

    var isServiceWorker = true;

}

var Helpers = {

    isValidJwt: function(jwt){

        if(!jwt) return false;

        var jwtSplit = jwt.toString().split('.');

        if(jwtSplit.length != 3) return false;

        try{

            var parsed = JSON.parse(atob(jwtSplit[1]));

            if(parsed.jti) return true;

        } catch(e){
            return false;
        }

        return true;

    },

    // @todo Colocar alertas
    timingDelay: function(){

        return new Promise((resolve, reject) => {

            setTimeout(resolve, 10);

        });

    },

    populateWithLoadingElms: function(elm, howMuch, delay){

        if(typeof howMuch == 'undefined') howMuch = 4;
        if(typeof delay   == 'undefined') delay   = 300;

        for(var i = 0; i < howMuch; i++){

            var fakeElm = $('<div class="fake"></div>');

            fakeElm.css({
                animationDelay: delay * i + 'ms'
            });

            elm.append(fakeElm);

        }

    },

    _assets: {
        animationSVG: '<svg width="20" height="18" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid"><circle cx="50" cy="50" fill="none" stroke="#ec538b" stroke-width="10" r="35" stroke-dasharray="164.93361431346415 56.97787143782138" transform="rotate(338.201 50 50)">  <animateTransform attributeName="transform" type="rotate" repeatCount="indefinite" dur="1s" values="0 50 50;360 50 50" keyTimes="0;1"></animateTransform></circle></svg>',
        animationSVGWidth30: '<svg width="30" height="30" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid"><circle cx="50" cy="50" fill="none" stroke="#ec538b" stroke-width="10" r="35" stroke-dasharray="164.93361431346415 56.97787143782138" transform="rotate(338.201 50 50)">  <animateTransform attributeName="transform" type="rotate" repeatCount="indefinite" dur="1s" values="0 50 50;360 50 50" keyTimes="0;1"></animateTransform></circle></svg>',
        bigAnimationSVG: '<svg width="300" height="300" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid"><circle cx="50" cy="50" fill="none" stroke="#6e8a9b" stroke-width="10" r="35" stroke-dasharray="164.93361431346415 56.97787143782138" transform="rotate(338.201 50 50)">  <animateTransform attributeName="transform" type="rotate" repeatCount="indefinite" dur="1s" values="0 50 50;360 50 50" keyTimes="0;1"></animateTransform></circle></svg>'
    },

    isLoading: function(btn){

        return !!$(btn).find('.loading-fill').length;

    },

    // @description O mesmo que loadingBtn porém desativa o uso do botão até a função
    // reset ser chamada novamente
    loading: function(btn){

        $(btn).addClass('disabled-btn');

        $(btn).find('.loading-fill').remove();

        $(btn).prepend('<span class="loading-fill">' + Helpers._assets.animationSVG + '</span>');

        return {

            reset: function(){

                $(btn).removeClass('disabled-btn');
                $(btn).find('.loading-fill').remove();

            }

        }       

    },

    loadingBtn: function(btn){

        $(btn).append('<span class="loading-fill">' + Helpers._assets.animationSVG + '</span>');

        return {

            reset: function(){

                $(btn).find('.loading-fill').remove();

            }

        }

    },

    loadingState: function(btn, promise){

        let originalContent = btn.css('opacity', 0);

        let loadingBtn = $('<span class="loading-fill">' + Helpers._assets.animationSVGWidth30 + '</span>');

        $(btn).before(loadingBtn);

        let loading = {

            reset: function(){

                loadingBtn.remove();

            }

        }

        promise.then(function(){

            loading.reset();
            btn.css('opacity', 1);

        });

    },

    // @todo Fazer mais comentários
    calcMediaQuery: function(w, o){

        var final = 0;

        Object.keys(o).sort(function(a, b){

            return Number(a) - Number(b);

        }).reverse().forEach(function(v, k){

            if(k === 0){
                final = o[v];
            }

            if(v >= w) final = o[v];

        });

        return final;

    },

    gridAppend: function(parent, child, opts){

        if(typeof child == 'undefined') return console.error('Child arg required');

        if(typeof opts === 'undefined'){

            opts = {
                640:     1,
                1000:    2,
                9999999999999999: 3
            }

        }

        if(!opts.default) opts.default = 3;

        var width = $(document).width();

        var columns     = [];
        var gridK       = 0;

        // Checa se possui grid
        var gridColumns = $(parent).find('.grid-columns');

        var columnCount = opts.default;

        // Se não tem esse grid, vamos criar
        if(!gridColumns.length){

            columnCount = Helpers.calcMediaQuery(width, opts);

            for(var i = 0; i < columnCount; i++){

                columns.push($('<div class="grid-columns"></div>'));

                var gridWidth = (100 - columnCount) / columnCount;

                columns[i].css('width', gridWidth + '%');
                columns[i].css('margin-right', '1%');

                $(parent).append(columns[i]);

            }

        } else{

            for(var i = 0; i < gridColumns.length; i++){

                columns.push($(gridColumns[i]));

                gridK += columns[i].children().length;

            }

        }

        child.attr('data-tabindex', gridK);

        if(columnCount == 1){

            $(parent).append(child);

        } else{

            columns[gridK % columns.length].append(child);

        }

    },

    toCnpj: function(str){

        return str.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, "$1.$2.$3/$4-$5");

    },

    // Separa um array em dias(Helpers.getBeautifulDate)
    // @sintaticalSugar
    separateByDay: function(items, prop, inOrder){

        // Usa uma função alternativa
        return Helpers.separateBy(items, prop, Helpers.getBeautifulDate);

    },

    // Separa um array em dias(Helpers.getBeautifulDate)
    separateBy: function(items, prop, f){

        // @todo Verificar se essa função fica melhor nesse estilo
        // pois dessa maneira, qualquer função pode ser usada para 
        // separação de arrays
        if(typeof f === 'undefined') f = Helpers.getBeautifulDate;

        // Guarda os agrupamentos de itens, nesta função nativa para dias
        var days = {};

        // Itera entre os itens
        items.forEach(function(item){

            // Pega a propriedade principal do item
            var value    = item[prop];

            // Pega o texto que determina o dia atual
            var dayValue = f(value);

            // Casonão exista essa propriedade dentro do objeto, vamos cria-la
            if(typeof days[dayValue] === 'undefined') days[dayValue] = [];

            // Adicionamos o item atual a essa chave dayValue
            days[dayValue].push(item);

        });

        // Retorno do resultado
        return days;

    },

    subtract: function(a, b){

        var ret = "";

        var theKeys = {};

        a.split("\n").forEach(line => {

            var lineColumns = line.split("\t");

            var key = lineColumns[0].trim().toUpperCase() + '-' + lineColumns[1].trim().toUpperCase() + '-' + lineColumns[3].trim();

            theKeys[key] = lineColumns[4];

        });

        b.split("\n").forEach(line => {

            var lineColumns = line.split("\t");

            var key = lineColumns[0].trim().toUpperCase() + '-' + lineColumns[1].trim().toUpperCase() + '-' + lineColumns[3].trim();

            if(theKeys[key]){
            
                theKeys[key] -= lineColumns[4]

            } else{

                theKeys[key] = lineColumns[4];

            }

        });

        Object.keys(theKeys).forEach(function(key){

            var keyVal = theKeys[key];

            if(keyVal !== 0){

                ret += key.replace(/\-/g, "\t") + "\t\t" + keyVal + "\n";

            }

        });

        return ret;

    },

    sum: function(a, b){

        var ret = "";

        var theKeys = {};

        a.split("\n").forEach(line => {

            var lineColumns = line.split("\t");

            var key = lineColumns[0].trim().toUpperCase() + '-' + lineColumns[1].trim().toUpperCase() + '-' + lineColumns[3].trim();

            theKeys[key] = lineColumns[4];

        });

        b.split("\n").forEach(line => {

            var lineColumns = line.split("\t");

            var key = lineColumns[0].trim().toUpperCase() + '-' + lineColumns[1].trim().toUpperCase() + '-' + lineColumns[3].trim();

            if(theKeys[key]){
            
                theKeys[key] += lineColumns[4]

            } else{

                theKeys[key] = lineColumns[4];

            }

        });

        Object.keys(theKeys).forEach(function(key){

            var keyVal = theKeys[key];

            if(keyVal !== 0){

                ret += key.replace(/\-/g, "\t") + "\t\t" + keyVal + "\n";

            }

        });

        return ret;

    },

    // @template
    // Helpers.forEachPromise(items, function(item){
    // 
    //     return Orders.toPicking(item);
    // 
    // });
    forEachPromise: function(arr, callback){

        if(!arr || arr.length == 0) return Promise.resolve();

        return new Promise(function(resolve, reject){

            var index = 0;

            var tick = function(){

                if(typeof arr[index] === 'undefined'){

                    return resolve();

                }

                callback(arr[index]).then(function(){

                    index++;

                    tick();

                });

            }

            tick();

        });

    },

    searchArr: function(arr, opts){

        return arr.filter(function(item){

            var ret = false;

            if(!opts.search) return true;

            opts.columns.forEach(function(column){

                // Caso exista algum termo encontrado
                if(item[column] && ~item[column].toLowerCase().indexOf(opts.search)){

                    ret = true;

                }

            });

            return ret;

        });

    },

    // @version 2.0
    isToday: function(date){

        date = new Date(date);

        return date.toDateString() === new Date().toDateString();

    },

    cloneObject: function(obj){

        return JSON.parse(JSON.stringify(obj));

    },

    component: function(qs, obj){

        var elm = $('.components').find(qs).clone();

        elm.find('[data-value]').each(function(){

            var propName = $(this).attr('data-value');

            var val = obj[propName];

            // @todo Verificar o tipo do elemento, se for do tipo input, devemos adicionar
            // o valor por val ao invés de html

            if(val) $(this).html(val);

        });

        return elm;

    },

    getBeautifulDate: function(unixtime){

        if(typeof unixtime === 'undefined') unixtime = new Date().getTime();

        var date = new Date(unixtime);

        return date.getDate() + ' de ' + Vars.months[date.getMonth()];

    },

    similarity: function(s1, s2){

        var longer  = s1;
        var shorter = s2;

        if(s1.length < s2.length){
            longer  = s2;
            shorter = s1;
        }

        var longerLength = longer.length;

        if(longerLength == 0){
            return 1.0;
        }

        return (longerLength - Helpers.levenshteinDistance(longer, shorter)) / parseFloat(longerLength);

    },

    // @deprecated
    levenshteinDistance: function(s1, s2){

        s1 = s1.toString().toLowerCase();
        s2 = s2.toString().toLowerCase();

        var costs = new Array();

        for(var i = 0; i <= s1.length; i++){

            var lastValue = i;
            
            for(var j = 0; j <= s2.length; j++){

                if (i == 0) costs[j] = j;
                else {

                    if (j > 0) {

                        var newValue = costs[j - 1];

                        if (s1.charAt(i - 1) != s2.charAt(j - 1)) newValue = Math.min(Math.min(newValue, lastValue), costs[j]) + 1;
                        
                        costs[j - 1] = lastValue;
                        lastValue = newValue;

                    }

                }

            }

            if (i > 0) costs[s2.length] = lastValue;

        }

        return costs[s2.length];

    },

    decodeUtf: function(string){

        try{

            return decodeURIComponent(escape(string))

        } catch(e){

            return string;

        }

    },

    csvColumns: function(choseColumns){

        return Helpers.choseColumnsExcelImport(choseColumns).then(function(ret){

            var columns = Object.keys(ret.columns);
            var aux     = [];

            ret.parsed.forEach(function(item){

                var obj = {};

                columns.forEach(function(column){

                    obj[column] = item[ret.columns[column]];

                });

                aux.push(obj);

            });

            return {
                info: ret.fileInfo,
                columns: ret.columns,
                parsed: aux
            };

        });

    },

    csvValues: function(choseColumns){

        return Helpers.choseColumnsExcelImport(choseColumns).then(function(ret){

            var columns = Object.keys(ret.columns);
            var aux     = [];

            ret.parsed.forEach(function(item){

                var line = [];

                columns.forEach(function(column){

                    line.push(item[ret.columns[column]]);

                });

                aux.push(line);

            });

            return {
                info: ret.fileInfo,
                columns: ret.columns,
                parsed: aux
            };

        });

    },

    choseColumnsExcelImport: function(choseColumns){

        return new Promise(function(resolve, reject){

            Helpers.importExcel().then(function(imported){

                var parsed = imported.data;

                var finalList = {};

                var columns = imported.columns;

                var toChoseColumns = choseColumns;

                // Adiciona o ignorar na frente
                toChoseColumns.unshift('Ignorar');

                Alerts.open('.chose-columns', {

                    ready: function(modal){

                        var example = modal.find('.example');

                        var firstLine = $('<p></p>');

                        columns.forEach(function(column){

                            firstLine.append('<span>' + column + '</span>');

                        });

                        example.append(firstLine);

                        for(var i = 0; i < 4; i++){

                            var exampleLine = $('<p></p>');

                            if(!parsed[i]) continue;

                            columns.forEach(function(columnName){

                                var column = parsed[i][columnName];

                                var columnElm = $('<span>' + column + '</span>');

                                exampleLine.append(columnElm);

                            });

                            example.append(exampleLine);

                        }

                        // Ao clicar em importar
                        modal.find('.save').on('click', function(){

                            // Guarda a lista das colunas selecionadas
                            var selectedColumns = {};

                            // Vamos passar por cada select
                            modal.find('.list select').each(function(){

                                // E ignorar, caso esteja selecionado para ignorar a coluna
                                if($(this).val() == 'Ignorar') return;

                                selectedColumns[$(this).val()] = $(this).attr('data-label');

                            });

                            resolve({
                                columns: selectedColumns,
                                parsed: parsed,
                                fileInfo: imported.fileInfo
                            });

                            Alerts.close(modal);

                        });

                        modal.find('.how-many').text(parsed.length);

                        columns.forEach(function(column){

                            var options = '';

                            toChoseColumns.forEach(function(toChose){

                                var attrs = '';

                                // @test, @tested 2:51, 5-fev-2020
                                // @bug
                                if(Helpers.similarity(column, toChose) >= .9){

                                    attrs += 'selected';

                                }

                                options += '<option ' + attrs + '>' + toChose + '</option>';

                            });

                            modal.find('.list').append('\
                                <p>\
                                    <label>A coluna ' + column + ' equivale a </label>\
                                    <select data-label="' + column + '">\
                                    ' + options + '\
                                    </select>\
                                </p>\
                                ')

                        });

                        Alerts.centralize(modal);

                    }

                });

            });

        });

    },

    readFile: function(opts){

        return Helpers.importFile(opts).then(function(file){

            return Helpers.getContent(file);

        });

    },

    importFile: function(opts){

        if(typeof opts == 'undefined'){

            opts = {};

        }

        if(typeof opts.identifier == 'undefined'){

            opts.identifier = '';

        }

        if(opts.identifier){

            $('<input data-identifier="' + opts.identifier + '" type="file">').remove();

        }

        return new Promise(function(resolve, reject){

            // Vamos criar esse elemento, com o determinado id, para que possamos
            // identifica-lo na próxima iteração
            var fileElm = $('<input data-identifier="' + opts.identifier + '" type="file">');

            // Quando houver uma mudança, como a adiçao de um arquivo
            fileElm.on('change', function(){

                var file = fileElm.get(0).files[0];

                resolve(file);

                fileElm.remove();

            });

            fileElm.click();

        });

    },

    importExcel: function(fileId, callback){

        if(typeof callback === 'undefined') callback = function(){};

        return new Promise(function(resolve, reject){

            // Caso o fileId não esteja definido
            if(typeof fileId === 'undefined'){

                // Vamos criar um id para ele
                fileId = uuid();

                // Remove este elemento, caso já exista
                $('input[data-file-id="' + fileId + '"]').remove();

                // Vamos criar esse elemento, com o determinado id, para que possamos
                // identifica-lo na próxima iteração
                var fileElm = $('<input data-file-id="' + fileId + '" type="file">');

                // Quando houver uma mudança, como a adiçao de um arquivo
                fileElm.on('change', function(){

                    var loading = Alerts.loading('<h1>Aguarde...</h1><hr><p>Processando arquivo.<br>Demorará proporcionalmente ao tamanho do arquivo</p>');

                    var loadingTimeout = setTimeout(function(){

                        fileElm.remove();
                        loading.close();

                        Alerts.loading('<h1>Recarregue a página</h1><hr><p>Ocorreu um erro e não foi possível carregar o arquivo.</p>');

                    }, 10000);

                    Helpers.importExcel(fileId, function(imported){

                        clearTimeout(loadingTimeout);

                        var columns = imported.columns;
                        var data    = imported.data;

                        var file = fileElm.get(0).files[0];

                        var fileInfo = {
                            name:         file.name,
                            size:         file.size,
                            lastModified: file.lastModified
                        }

                        data.fileInfo = fileInfo;

                        resolve({
                            data: data,
                            columns: columns,
                            fileInfo: fileInfo
                        });

                        fileElm.remove();
                        loading.close();

                    });

                });

                $('.invisible').append(fileElm);

                fileElm.click();

            } else{

                var file = $('input[data-file-id="' + fileId + '"]').get(0);

                Helpers.parseExcelRows(file.files[0]).then(callback);

            }

        });

    },

    // @todo Entender essa função, que foi basicamente copiar e colar
    parseXml: function(xml, arrayTags){

        var dom = null;
        if (window.DOMParser)
        {
            dom = (new DOMParser()).parseFromString(xml, "text/xml");
        }
        else if (window.ActiveXObject)
        {
            dom = new ActiveXObject('Microsoft.XMLDOM');
            dom.async = false;
            if (!dom.loadXML(xml))
            {
                throw dom.parseError.reason + " " + dom.parseError.srcText;
            }
        }
        else
        {
            throw "cannot parse xml string!";
        }

        function isArray(o)
        {
            return Object.prototype.toString.apply(o) === '[object Array]';
        }

        function parseNode(xmlNode, result)
        {
            if (xmlNode.nodeName == "#text") {
                var v = xmlNode.nodeValue;
                if (v.trim()) {
                   result['#text'] = v;
                }
                return;
            }

            var jsonNode = {};
            var existing = result[xmlNode.nodeName];
            if(existing)
            {
                if(!isArray(existing))
                {
                    result[xmlNode.nodeName] = [existing, jsonNode];
                }
                else
                {
                    result[xmlNode.nodeName].push(jsonNode);
                }
            }
            else
            {
                if(arrayTags && arrayTags.indexOf(xmlNode.nodeName) != -1)
                {
                    result[xmlNode.nodeName] = [jsonNode];
                }
                else
                {
                    result[xmlNode.nodeName] = jsonNode;
                }
            }

            if(xmlNode.attributes)
            {
                var length = xmlNode.attributes.length;
                for(var i = 0; i < length; i++)
                {
                    var attribute = xmlNode.attributes[i];
                    jsonNode[attribute.nodeName] = attribute.nodeValue;
                }
            }

            var length = xmlNode.childNodes.length;
            for(var i = 0; i < length; i++)
            {
                parseNode(xmlNode.childNodes[i], jsonNode);
            }
        }

        var result = {};
        for (var i = 0; i < dom.childNodes.length; i++)
        {
            parseNode(dom.childNodes[i], result);
        }

        return result;

    },

    jsonToRelacional: function(json){

        var columns = Object.keys(json[0]);

        var relacional = [];

        json.forEach(function(item){

            var line = []

            columns.forEach(function(column){

                line.push(item[column]);

            });

            relacional.push(line);

        });

        return relacional;

    },

    // @deprecated Usar makeExcel
    exportJsonToCsv: function(json, name){

        var toExport = Helpers.jsonToRelacional(json);

        var csvContent = "data:text/csv;charset=utf-8,";

        if(typeof name === 'undefined'){

            name = 'Sem titulo.csv';

        }

        var n = 0;

        toExport.forEach(function(rowArray){

            n++;

            var row = rowArray.join(";");
            csvContent +=row + "\r\n";

        });

        var encodedUri = encodeURI(csvContent);

        var link = document.createElement("a");

        link.setAttribute("href", encodedUri);
        link.setAttribute("download", name + '.csv');

        document.body.appendChild(link);

        link.click();

    },

    makeExcel: function(json, name){

        var table = Helpers.jsonToRelacional(json);

        var ws_name = "Reservados";

        var wb = XLSX.utils.book_new();
        var ws = XLSX.utils.aoa_to_sheet(table);

        XLSX.utils.book_append_sheet(wb, ws, ws_name);

        XLSX.writeFile(wb, name);

    },

    // @dependency https://github.com/SheetJS/sheetjs
    parseExcel: function(file){

        // Pega o binário do arquivo
        return Helpers.getBinary(file).then(function(data){

            // Lê o arquivo pelo script
            var workbook = XLS.read(data, {
                type: 'binary',
                raw: true
            });

            var result = {};

            // Passa por cada aba
            workbook.SheetNames.forEach(function(sheetName){

                // Aqui, o arquivo é convertido para json
                var roa = XLS.utils.sheet_to_json(workbook.Sheets[sheetName], {
                    header: 1
                });

                // Caso haja resultado, vamos salvar
                if(roa.length){
                    result[sheetName] = roa;
                }

            });

            // Retorna o json
            return result;

        });

    },

    pagedArray(page, perPage, array){

        var pageItems = [];

        var total = Math.ceil(array.length / perPage);
        var start = (page-1) * perPage;
        var end   = page * perPage;

        array.forEach(function(item, k){

            if(k >= start && k < end) pageItems.push(item)

        });

        if(!pageItems.length){

            return false;

        }
        
        return pageItems;

    },

    parseExcelRows: function(file, sw){

        // if(!opts) opts = {}

        // if(typeof opts.sw === 'undefined'){
        //     opts.sw = true;
        // }

        // // @todo Permite 
        // if(typeof opts.multiple === 'undefined'){
        //     opts.multiple = true;
        // }

        if(!isServiceWorker && Default.bc && sw){

            return Default.toSw('Helpers.parseExcelRows', [file]);

        }

        return Helpers.parseExcel(file).then(function(parsed){

            var rows    = parsed[Object.keys(parsed)[0]];
            var columns = [];
            var data    = [];

            rows.forEach(function(row, k){

                // Caso seja a linha 1, vamos interpretar como os nomes das colunas
                if(k === 0){

                    for(var i = 0; i < row.length; i++){

                        var val = row[i];

                        if(!val){

                            val = '(sem valor)';

                        }

                        columns.push(val);

                    }

                    return;

                }

                var toPush = {};

                row.forEach(function(col, k){

                    toPush[columns[k]] = Helpers.decodeUtf(col);

                });

                data.push(toPush);

            });

            return {
                columns: columns,
                data:    data
            };

        });

    },

    parseStockExcelRows: function(file, opts){

        if(!opts) opts = {}

        if(typeof opts.sw === 'undefined'){
            opts.sw = true;
        }

        // @todo Permite 
        if(typeof opts.multiple === 'undefined'){
            opts.multiple = true;
        }

        if(!isServiceWorker && Default.bc && opts.sw){

            return Default.toSw('Helpers.parseExcelRows', [file]);

        }

        return Helpers.parseExcel(file).then(function(parsed){

            var rows    = parsed[Object.keys(parsed)[0]];
            var columns = [];
            var data    = [];

            rows.forEach(function(row, k){

                // Caso seja a linha 1, vamos interpretar como os nomes das colunas
                if(k === 0){

                    // Caso tenha 5 colunas e seja 
                    if(row.length == 5 && !isNaN(row[row.length-1])){

                        columns.push('Endereço');
                        columns.push('Ean');
                        columns.push('Sku');
                        columns.push('Nome');
                        columns.push('Quantidade');

                    } else{

                        for(var i = 0; i < row.length; i++){

                            var val = row[i];

                            if(!val){

                                val = '(sem valor ' + i + ')';

                            }

                            columns.push(val);

                        }

                        return;

                    }

                }

                var toPush = {};

                row.forEach(function(col, k){

                    toPush[columns[k]] = Helpers.decodeUtf(col);

                });

                data.push(toPush);

            });

            return {
                columns: columns,
                data:    data
            };

        });

    },

    getBase64: function(file){

        return new Promise(function(resolve, reject){

            var reader = new FileReader();
            
            reader.readAsDataURL(file);
            
            reader.onload = function () {
                resolve(reader.result);
            };
            
            reader.onerror = reject;

        });

    },

    getBinary: function(file){

        return new Promise(function(resolve, reject){

            var reader = new FileReader();
            
            reader.readAsBinaryString(file);
            
            reader.onload = function () {
                resolve(reader.result);
            };
            
            reader.onerror = reject;

        });

    },

    getContent: function(file){

        return new Promise(function(resolve, reject){

            var reader = new FileReader();
            
            reader.readAsText(file);
            
            reader.onload = function () {
                resolve(reader.result);
            };
            
            reader.onerror = reject;

        });

    },

    removeItem: function(arr, item){

        for( var i = 0; i < arr.length; i++){ 
           if ( arr[i] === item) {
             arr.splice(i, 1); 
           }
        }

    },

    arrRemove: function(arr, item){

        for( var i = 0; i < arr.length; i++){ 
           if ( arr[i] === item) {
             arr.splice(i, 1); 
           }
        }

    },

    /**
     * Quando determinado elemento estiver no html atual
     * @param  {[type]} querySelector Query selector do elemento a ser testado
     * @param  {[type]} unlimited     Caso unlimited seja true, não tem limite de tentativas
     * @return {[type]}               Promise que resolve quando o elemento for encontrado
     */
    whenElm: function (querySelector, unlimited) {

        if (unlimited === "undefined") unlimited = false;

        return new Promise(function (resolve, reject) {

            var maxLoop = 0;

            var timer = setInterval(function () {

                if (!unlimited && maxLoop > 150){
                    clearInterval(timer);
                    console.log('desativad');
                }

                if ($(querySelector).length) {
                    resolve($(querySelector));
                    clearInterval(timer);
                } else {
                    maxLoop++;
                }
            }, 100);

        });
    },

    /**
     * Quando determinada variavel estiver disponível
     * @param  {String} query A variavel a ser testada
     * @param  {Object} pre   O objeto que guarda a query
     * @return {Promise}      Promise que é resolvida quando a variavel é diferente de undefined
     */
    whenVar: function(query, pre, maxLoop){

        if(typeof maxLoop == 'undefined') maxLoop = 150;

        pre = pre || window;

        return new Promise(function(resolve, reject){

            var actualLoop = 0;

            var timer = setInterval(function(){

                if(actualLoop > maxLoop) clearInterval(timer);

                if(typeof pre[query] !== 'undefined'){
                    resolve(pre[query]);
                    clearInterval(timer);
                } else{
                    actualLoop++;
                }
            }, 100);

        });
    },

    capitalize: function(string){
        return string[0].toUpperCase() + string.substr(1);
    },

    standardCatch: function(e){

        Alerts.notify(e);

    },

    getSimpleHour: function(unixtime, outputSeconds){

        if(typeof unixtime === 'undefined') unixtime = new Date().getTime();

        if(typeof outputSeconds === 'undefined') outputSeconds = true;

        var date = new Date(unixtime);

        var hour    = date.getHours();
        var minutes = date.getMinutes();
        var seconds = date.getSeconds();

        if(hour < 10){
            hour = '0' + hour;
        }

        if(minutes < 10){
            minutes = '0' + minutes;
        }

        if(seconds < 10){
            seconds = '0' + seconds;
        }

        if(outputSeconds){
            outputSeconds = ':' + seconds;
        } else{
            outputSeconds = '';
        }

        return hour + ':' + minutes + outputSeconds;

    },

    getDbSimpleDate: function(unixtime, db){

        if(typeof unixtime === 'undefined'){
            unixtime = new Date().getTime();
        }

        var date = new Date(unixtime);

        var year  = date.getFullYear();
        var month = date.getMonth() + 1;
        var day   = date.getDate();

        if(month < 10){
            month = '0' + month;
        }

        if(day < 10){
            day = '0' + day;
        }

        var offset = date.getTimezoneOffset() / 60;

        if(offset < 10){
            offset = '0' + offset;
        }

        return year + '-' + month + '-' + day + 'T' + Helpers.getSimpleHour(unixtime) + '-' + offset + ':00';

    },

    getLightDate: function(unixtime, delimiter){

        if(typeof unixtime === 'undefined'){
            unixtime = new Date().getTime();
        }

        if(typeof delimiter === 'undefined'){
            delimiter = '-';
        }

        var date = new Date(unixtime);

        var year  = date.getFullYear();
        var month = date.getMonth() + 1;
        var day   = date.getDate();

        if(month < 10){
            month = '0' + month;
        }

        if(day < 10){
            day = '0' + day;
        }

        var offset = date.getTimezoneOffset() / 60;

        if(offset < 10){
            offset = '0' + offset;
        }

        return day + delimiter + month + delimiter + year;

    },

    downloadBuffer: function(buffer, filename){

        var blob = new Blob([new Uint8Array(buffer.data, 0, buffer.data.length)]);

        var link  = document.createElement('a');
        
        link.href = window.URL.createObjectURL(blob);

        link.download = filename;

        link.click();

    },

    getSimpleDate: function(unixtime, db){

        if(typeof unixtime === 'undefined'){
            unixtime = new Date().getTime();
        }

        if(typeof db === 'undefined'){

            db = false;

        }

        var date = new Date(unixtime);

        var year  = date.getFullYear();
        var month = date.getMonth() + 1;
        var day   = date.getDate();

        if(month < 10){
            month = '0' + month;
        }

        if(day < 10){
            day = '0' + day;
        }

        var offset = date.getTimezoneOffset() / 60;

        if(offset < 10){
            offset = '0' + offset;
        }

        var middleOne = db?'T':' ';

        return year + '-' + month + '-' + day + middleOne + Helpers.getSimpleHour(unixtime) + '-' + offset + ':00';

    },

    /**
     * Mascara CNPJ
     * @param { jQuery element | DOM element } elm input onde sera aplicada a marcara
     */
    maskCnpj: function (elm) {

        elm = $(elm);

        var c = elm.val();

        if (c.split('').length >= 18) c = c.substr(0, 18);

        c = c.replace(/(\D)/g, "");
        c = c.replace(/^(\d{2})(\d)/, "$1.$2");
        c = c.replace(/(\d{3})(\d)/, "$1.$2");
        c = c.replace(/(\d{3})(\d)/, "$1\/$2");
        c = c.replace(/(\d{4})(\d{2})$/, "$1-$2");

        elm.val(c);

    },

    /**
     * Mascara CPF
     * @param { jQuery element | DOM element } elm input onde sera aplicada a marcara
     */
    maskCpf: function (elm) {

        elm = $(elm);

        var c = elm.val();

        if (c.split('').length >= 9) c = c.substr(0, 18);

        c = c.replace(/(\D)/g, "");
        c = c.replace(/^(\d{3})(\d)/, "$1.$2");
        c = c.replace(/(\d{3})(\d)/, "$1.$2");
        c = c.replace(/(\d{3})(\d{2})$/, "$1-$2");

        elm.val(c);

    },

    /**
     * Mascara RG
     * @param { jQuery element | DOM element } elm input onde sera aplicada a marcara
     */
    maskRg: function (elm) {

        elm = $(elm);

        var c = elm.val();

        if (c.split('').length >= 8) c = c.substr(0, 18);

        c = c.replace(/[^\dXx]/g, "");
        c = c.replace(/^(\d{2})(\d)/, "$1.$2");
        c = c.replace(/(\d{3})(\d)/, "$1.$2");
        c = c.replace(/(\d{3})([\dXx]{1,2})$/, "$1-$2");

        elm.val(c);

    },

    /**
     * Mascara telefone
     * @param { jQuery element | DOM element } elm input onde sera aplicada a marcara
     */
    maskTel: function (elm) {

        elm = $(elm);

        var v = elm.val();

        if (v.split('').length > 15) v = v.substr(0, 15);

        v = v.replace(/\D/g, "");
        v = v.replace(/^(\d{2})(\d)/g, "($1) $2");
        v = v.replace(/(\d)(\d{4})$/, "$1-$2");

        elm.val(v);

    },

    mask: {

        tel: function (txt) {

            if(!txt) return txt;

            if (txt.split('').length > 15) txt = txt.substr(0, 15);

            txt = txt.replace(/\D/g, "");
            txt = txt.replace(/^(\d{2})(\d)/g, "($1) $2");
            txt = txt.replace(/(\d)(\d{4})$/, "$1-$2");

            return txt;

        },

    },

    /**
     * Mascara CEP
     * @param { jQuery element || DOM element } elm input onde sera aplicada a marcara
     */
    maskCep: function (elm) {

        elm = $(elm);

        var v = elm.val();

        if (v.split('').length > 9) v = v.substr(0, 9);

        v = v.replace(/\D/g, "");
        v = v.replace(/^(\d{5})(\d{3})$/g, "$1-$2");

        elm.val(v);

    },

    /**
     * Remove todos os caracteres não numericos de uma máscara
     * @param { String } value String com máscara
     * @returns { String } String sem máscara
     */
    unMask: function (value) {

        return value.replace(/([^0-9])/g, '');

    },

    /**
     * Valida CNPJ
     * @param { String } cnpj CNPJ a ser validado
     * @returns { Boolean } True se CNPJ for valido, false se não
     */
    validateCNPJ: function (cnpj) {

        cnpj = cnpj.replace(/[^\d]+/g, '');

        if (cnpj == '') return false;

        if (cnpj.length != 14) return false;

        if (cnpj == "00000000000000" ||
            cnpj == "11111111111111" ||
            cnpj == "22222222222222" ||
            cnpj == "33333333333333" ||
            cnpj == "44444444444444" ||
            cnpj == "55555555555555" ||
            cnpj == "66666666666666" ||
            cnpj == "77777777777777" ||
            cnpj == "88888888888888" ||
            cnpj == "99999999999999")
            return false;

        // Valida DVs
        var length = cnpj.length - 2,
            numbers = cnpj.substring(0, length),
            digits = cnpj.substring(length),
            sum = 0,
            pos = length - 7;

        for (i = length; i >= 1; i--) {
        
            sum += numbers.charAt(length - i) * pos--;

            if (pos < 2) pos = 9;

        }

        var result = sum % 11 < 2 ? 0 : 11 - sum % 11;

        if (result != digits.charAt(0)) return false;

        length = length + 1;
        numbers = cnpj.substring(0, length);
        sum = 0;
        pos = length - 7;

        for (i = length; i >= 1; i--) {

            sum += numbers.charAt(length - i) * pos--;

            if (pos < 2) pos = 9;

        }

        result = sum % 11 < 2 ? 0 : 11 - sum % 11;

        if (result != digits.charAt(1)) return false;

        return true;

    },

    /**
     * Mostra o loader no centro do elemento
     * @param { jQuery element | DOM element } elm Elemento onde o loader será colocado
     * @param { String | Number } size Tamanho opcional do loader
     * @returns { jQuery element } Elemento do loader
     */
    showLoader: function (elm, size) {

        elm = $(elm);
        
        var currentLoader = Helpers.getLoader(elm);

        if (currentLoader.length) return currentLoader;

        var elmPosition = elm.css('position');

        if (elmPosition == 'static')
            elm.css('position', 'relative');
        else if (elmPosition != 'sticky' && elmPosition != 'relative')
            return;

        size = size || 200;

        var top = (elm.outerHeight() / 2) - (size / 2),
            left = (elm.outerWidth() / 2) - (size / 2);

        var loaderSpinner = $('<div class="loader-spinner"></div>');

        loaderSpinner.css({ 'width': size, 'height': size, 'top': top, 'left': left });

        elm.append(loaderSpinner);

        return loaderSpinner;

    },

    /**
     * Pega o loader no elemento
     * @param { jQuery element | DOM element } elm Elemento contendo o loader
     * @returns { jQuery element } Loader no elemento
     */
    getLoader: function (elm) {

        return $(elm).find('.loader-spinner');

    },

    /**
     * Remove o loader da tela
     * @param { jQuery element | DOM element } loaderElm Loader específico para ser removido
     */
    removeLoader: function (loaderElm) {

        loaderElm = $(loaderElm);

        if (loaderElm.length) {

            if (loaderElm.hasClass('loader-spinner')) loaderElm.remove();

        } else $('.loader-spinner').remove();

    },

    /**
     * Formata um valor para moeda brasileira
     * @param { String | Number } price Numero valido
     * @returns { String } Valor formatado
     */
    formatPrice: function (price) {

        var priceNumber = Number(price);

        if (priceNumber !== priceNumber) throw 'Cannot format \'' + price + '\', not a number';

        return priceNumber.toLocaleString('pt-BR', { 'minimumFractionDigits': 2 });

    },

    months: ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'],

    /**
     * Retorna o nome do mês pelo seu número
     * @param { Number } monthNumber Número do mês
     * @returns { String } Nome do mês
     */
    getMonthName(monthNumber) {

        return Helpers.months[monthNumber];

    },

    /**
     * Retorna o número do mês pelo seu nome
     * @param { Number } monthName Nome do mês
     * @returns { String } Número do mês
     */
    getMonthNumber(monthName) {

        return Helpers.months.findIndex(name => name.toLowerCase() == monthName.toLowerCase()) + 1;

    },

    /**
     * Converte RGB para hexadecimal
     * @param { Array } rgbArr Array de RGB
     * @returns { String } Hexadecimal
     */
    convertRgbToHex(rgbArr) {

        return rgbArr.splice(0, 3).reduce((result, color) => {

            color = Number(color).toString(16);
            color = color.length == 1 ? '0' + color : color;
    
            return result + color;
    
        }, '');

    },

}

if(isServiceWorker){

    Bc.register('Helpers.parseExcelRows', Helpers.parseExcelRows);

}

// Warn if overriding existing method
if(!Array.prototype.equals){
        
    Array.prototype.equals = function (array) {
        // if the other array is a falsy value, return
        if (!array)
            return false;

        // compare lengths - can save a lot of time 
        if (this.length != array.length)
            return false;

        for (var i = 0, l=this.length; i < l; i++) {
            // Check if we have nested arrays
            if (this[i] instanceof Array && array[i] instanceof Array) {
                // recurse into the nested arrays
                if (!this[i].equals(array[i]))
                    return false;       
            }           
            else if (this[i] != array[i]) { 
                // Warning - two different object instances will never be equal: {x:20} != {x:20}
                return false;   
            }           
        }       
        return true;
    }
    // Hide method from for-in loops
    Object.defineProperty(Array.prototype, "equals", {enumerable: false});
    
}
