
function SmartFrontRepository() {
    this.dictionary = new Dictionary();
    this.set = function (domElement, data) {
        var element = $(domElement);
        if (element.length === 0) {
            console.warning('element not found');
            return false;
        }
        if ($(domElement).length === 1) {
            $(domElement).attr('sf-data', JSON.stringify(data));
            return true;
        } else {
            $(domElement).first().attr('sf-data', JSON.stringify(data));
            console.warning('element not many');
            return true;
        }
    };
    this.get = function (domElement) {
        var element = $(domElement);
        if (element.length === 0) {
            console.warning('element not found');
            return undefined;
        }
        var json;
        if ($(domElement).length === 1) {
            json = $(domElement).attr('sf-data');

        } else {
            json = $(domElement).first().attr('sf-data');
            console.warning('element not many');
        }
        if (json === undefined) {
            json = "{}";
        }
        return JSON.parse(json);
    };
    this.remove = function (domElement, id) {
        var index = this.indexOf(domElement, id);
        if (index !== -1) {
            var data = this.get(domElement);
            data.splice(index, 1);
            this.set(domElement, data);
            return true;
        }
        return false;
    };
    this.removeFromArray = function (array, id) {
        var index = this.IndexOfFromArray(array, id);
        if (index !== -1) {
            var data = array;
            data.splice(index, 1);
            return data;
        }
        return undefined;
    };
    this.getById = function (domElement, id) {
        var index = this.indexOf(domElement, id);
        if (index !== -1) {
            var data = this.get(domElement);
            return data[index];
        }
        return undefined;
    };
    this.GetByIdFromArray = function (data, id) {
        var index = this.IndexOfFromArray(data, id);
        if (index !== -1) {
            return data[index];
        }
        return undefined;
    };
    this.indexOf = function (domElement, id) {
        var data = this.get(domElement);
        if (data.length > 0) {
            for (var i = 0; i < data.length; i++) {
                if (data[i].Id === id) {
                    return i;
                }
            }
        }
        return -1;
    };
    this.IndexOfFromArray = function (data, id) {
        if (data.length > 0) {
            for (var i = 0; i < data.length; i++) {
                if (data[i].Id === id) {
                    return i;
                }
            }
        }
        return -1;
    };
};