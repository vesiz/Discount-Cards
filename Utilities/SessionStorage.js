const FILTER_SETTINGS_KEY = "filterSettings";

const SessionStorage = {

    getCurrentFilterSetting(){
        if(!sessionStorage.hasOwnProperty(FILTER_SETTINGS_KEY)){
            this.setCurrentFilterSettings(CURRENT_FILTER_SETTINGS);
        }
        
        let filterSettings = JSON.parse(sessionStorage.getItem(FILTER_SETTINGS_KEY));

        return filterSettings;
    }, 

    setCurrentFilterSettings(_filterSettings){
        let filterSettings = JSON.stringify(_filterSettings);
        sessionStorage.setItem(FILTER_SETTINGS_KEY, filterSettings);
    }
};