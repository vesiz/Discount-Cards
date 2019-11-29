const MiscUIManager = {
    toggleEntityButtonVisibility(_type, _mode) {
        if (_mode == BUTTONS_VISIBILITY.create) {
            document.getElementById(`${_type}-submit`).style.display = "inline";
            document.getElementById(`${_type}-update`).style.display = "none";
            document.getElementById(`${_type}-reset`).value = "Reset";

        } else if (_mode == BUTTONS_VISIBILITY.update) {
            document.getElementById(`${_type}-submit`).style.display = "none";
            document.getElementById(`${_type}-update`).style.display = "inline";
            document.getElementById(`${_type}-reset`).value = "Cancel";

        }
    },

    setFilterDateRange(_datepicker) {
        let currentDate = new Date();
        let datepicker = document.getElementById(_datepicker);
        datepicker.min = `${currentDate.getFullYear()}-${currentDate.getMonth() + 1}-${currentDate.getDate()}`;
        datepicker.max = "2099-12-31";
        datepicker.value = `${currentDate.getFullYear()}-${currentDate.getMonth() + 1}-${currentDate.getDate()}`;
    }
};

