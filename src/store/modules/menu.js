const menu = {
    state:{
        menuList : [],
        isCollapse : false
    },
    mutations:{
        addMenu(state,menuList){
            state.menuList = menuList
        },
        changeIsCollapse(state,collapse){
            state.isCollapse = !state.isCollapse
        }
    },
    actions:{
        actionMethod(context){

        },

    },
    
};
export default menu