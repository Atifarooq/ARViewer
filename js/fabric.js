import { VctrApi } from "https://www.vectary.com/viewer-api/v1/api.js";
//import controlColorPicker from "../js/colorpicker.js";

let ObjectList = [];
let viewerApi;

async function run(model) {

    function errHandler(err) {
        console.log("API error", err);
    }

    async function onReady() {
        console.log("API ready");
        try {

            const meshed = await viewerApi.getMeshes();
            console.log("Meshed", meshed);
            const allSceneObjects = await viewerApi.getObjects();
            ObjectList = allSceneObjects.filter(obj => obj.type == "mesh");


        } catch (e) {
            errHandler(e);
        }
    }

    viewerApi = new VctrApi(model, errHandler);

    try {
        await viewerApi.init();
        onReady();
    } catch (e) {
        errHandler(e);
    }
};

async function togglevisibility(obj, visiblity = true) {
    obj.visible = visiblity;
    await viewerApi.setVisibility(obj.name, obj.visible, false);
}

document.body.onload = function () {

    document.querySelectorAll('.radio-button').forEach(item => {
        item.addEventListener('click', (event) => {
            const name = event.target.getAttribute('name');

            const elements = document.querySelectorAll('div[name^='+ name.substr(0, name.length - 1) +']')
            for (let index = 0; index < elements.length; index++) {
                const element = elements[index];
                element.classList.remove("active");
                if(name == element.getAttribute('name')) {
                    element.classList.add("active");
                }
            }

            const obj = ObjectList.filter(obj => obj.name == name)[0];
            togglevisibility(obj, true);

            if (name.substr(0, name.length - 1) == 'Fabric_Option_') {
                let hiddName = name == 'Fabric_Option_2' ? 'Fabric_Option_1' : 'Fabric_Option_2';
                const obj = ObjectList.filter(obj => obj.name == hiddName)[0];
                togglevisibility(obj, false);
            }

            if (name.substr(0, name.length - 1) == 'Bottone_3D_') {

                if (name == 'Bottone_3D_1') {
                    const obj = ObjectList.filter(obj => (obj.name == 'Bottone_3D_2' || obj.name == 'Bottone_3D_3'));
                    for (let index = 0; index < obj.length; index++) {
                        const element = obj[index];
                        togglevisibility(element, false);
                    }
                }
                else if (name == 'Bottone_3D_2') {
                    const obj = ObjectList.filter(obj => (obj.name == 'Bottone_3D_1' || obj.name == 'Bottone_3D_3'));
                    for (let index = 0; index < obj.length; index++) {
                        const element = obj[index];
                        togglevisibility(element, false);
                    }
                }
                else if (name == 'Bottone_3D_3') {
                    const obj = ObjectList.filter(obj => (obj.name == 'Bottone_3D_1' || obj.name == 'Bottone_3D_2'));
                    for (let index = 0; index < obj.length; index++) {
                        const element = obj[index];
                        togglevisibility(element, false);
                    }
                }
            }
        });
    });


    run('3e6302de-21c3-4ffe-8bea-41f42403ba00');
}