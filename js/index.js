import { VctrApi } from "https://www.vectary.com/viewer-api/v1/api.js";
import controlColorPicker from "../js/colorpicker.js";

let ObjectList = [];
let viewerApi;
let selectedObject;

async function run() {

    function errHandler(err) {
        console.log("API error", err);
    }

    async function onReady() {
        console.log("API ready");
        try {


            document.body.addEventListener("click", async (event) => {
                if (event.target.id && event.target.id == 'd6c1f27d-6a27-4c7e-bd7d-bd19d7faa56c') {
                    selectedObject = await viewerApi.getHitObjects();
                    showControlpanel();
                    handleObjectClick(selectedObject);
                }
            });

            // const allSceneObjects = await viewerApi.getObjects();
            // console.log("Objects", allSceneObjects);

            // const allSceneMaterials = await viewerApi.getMaterials();
            // console.log("Materials", allSceneMaterials);

            // const myMaterialProps = await viewerApi.getMaterialProperties("Blue material");
            // console.log("Material properties: ", myMaterialProps);

            const meshed = await viewerApi.getMeshes();
            console.log("Meshed", meshed);
            const allSceneObjects = await viewerApi.getObjects();
            buildObjectList(allSceneObjects.filter(obj => obj.type == "mesh"));

        } catch (e) {
            errHandler(e);
        }
    }

    viewerApi = new VctrApi("d6c1f27d-6a27-4c7e-bd7d-bd19d7faa56c", errHandler);

    try {
        await viewerApi.init();
        onReady();
    } catch (e) {
        errHandler(e);
    }
};

async function handleObjectClick(obj) {

    try {
        console.log("Objects:", obj[0]);

        const controlheadtitle = document.querySelector("#control-head-title");
        controlheadtitle.textContent = formatName(obj[0].name);
        setControlValues();

    } catch (error) {

    }
}

async function updateObject(prop) {
    try {
        const { material } = selectedObject[0];
        await viewerApi.updateMaterial(material, prop);
    } catch (error) {

    }
}

function formatName(name) {
    return name.replace(/_/g, ' ');
}

function handleRangeChange(event) {
    const { name, value } = event.target;
    updateObject({ [name]: parseFloat(value).toFixed(0) });
}

async function setControlValues() {
    const { material } = selectedObject[0];

    const Material = await viewerApi.getMaterialProperties(material);

    document.querySelectorAll('input[type=range]').forEach(item => {
        item.value = Material[item.name];
    });
}

function showControlpanel() {
    const ctrl = document.querySelector('.control-panel');
    ctrl.style.display = "block";
}

function hideControlpanel() {
    const ctrl = document.querySelector('.control-panel');
    ctrl.style.display == "none"
}

function buildObjectList(ObjectList) {
    const objectListDOM = document.querySelector('#object-list');

    for (let index = 0; index < ObjectList.length; index++) {
        const element = ObjectList[index];

        var wrap = document.createElement("li");

        var wrapDiv = document.createElement("div");
        wrapDiv.classList = 'control-checklist';

        var chkLabel = document.createElement("label");
        chkLabel.classList = 'chkwrap';

        var chkInput = document.createElement("input");
        chkInput.type = 'checkbox';
        chkInput.checked = true;
        chkInput.classList = 'chkVisibility'

        chkInput.addEventListener('change', (event) => togglevisibility(element));

        var chkSpan = document.createElement("span");
        chkSpan.classList = 'checkmark';

        chkLabel.appendChild(chkInput);
        chkLabel.appendChild(chkSpan);

        var action = document.createElement("a");
        action.classList = "control-object-action cursor-pointer animate__animated animate__bounceIn";
        action.textContent = formatName(element.name);

        wrapDiv.appendChild(chkLabel);
        wrapDiv.appendChild(action);

        wrap.appendChild(wrapDiv);

        objectListDOM.appendChild(wrap);

    }

}

async function togglevisibility(obj) {
    obj.visible = !obj.visible;
    await viewerApi.setVisibility(obj.name, obj.visible, false);
    console.dir(await viewerApi.getObjectsByName(obj.name));
}

run();

document.body.onload = function () {

    hideControlpanel();

    controlColorPicker.on(["color:init", "color:change"], color => {
        if (selectedObject)
            updateObject({ color: color.hexString });
    });

    document.querySelectorAll('input[type=range]').forEach(item => {
        item.addEventListener('change', event => {
            handleRangeChange(event);
        })
    });

    document.querySelectorAll('input[type=checkbox]').forEach(item => {
        item.addEventListener('change', event => {
            togglevisibility(event);
        })
    });

}

