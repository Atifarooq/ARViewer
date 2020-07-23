import { VctrApi } from "https://www.vectary.com/viewer-api/v1/api.js";
import controlColorPicker from "../js/colorpicker.js";

let ObjectList = [];
let viewerApi;
let selectedObject;
let rotation = 360;

async function run(model) {

    function errHandler(err) {
        console.log("API error", err);
    }

    async function onReady() {
        console.log("API ready");
        try {


            await viewerApi.rotateView([0, rotation]);

            document.body.addEventListener("click", async (event) => {
                if (event.target.id && event.target.id == model) {
                    selectedObject = await viewerApi.getHitObjects();
                    showControlpanel();
                    //await handleObjectClick(selectedObject);
                    setControlValues();
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

    viewerApi = new VctrApi(model, errHandler);

    try {
        await viewerApi.init();
        onReady();
    } catch (e) {
        errHandler(e);
    }
};

async function handleObjectClick(obj) {

    try {
        const controlheadtitle = document.querySelector("#control-head-title");
        controlheadtitle.textContent = formatName(obj[0].name);

        await setControlValues();

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
    return name.replace(/_/g, ' ').toString().trim();
}

function handleRangeChange(event) {
    const { name, value } = event.target;
    updateObject({ [name]: parseFloat(value).toFixed(0) });
}

async function setControlValues() {
    const { material } = selectedObject[0];

    document.querySelectorAll('.checkmark').forEach(item => {
        item.classList = `checkmark`;
    });

    let checkIcon = document.querySelector(`span[data-label=${selectedObject[0].name}]`);
    checkIcon.classList = `${checkIcon.classList} active`;

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

        let name = formatName(element.name);
        var chkSpan = document.createElement("span");
        chkSpan.classList = 'checkmark';
        chkSpan.setAttribute('data-label', element.name);

        chkLabel.appendChild(chkInput);
        chkLabel.appendChild(chkSpan);

        var action = document.createElement("a");
        action.classList = "control-object-action cursor-pointer animate__animated animate__bounceIn";
        action.textContent = name;
        action.addEventListener('click', (event) => {
            let item = [];
            item.push(element);
            selectedObject = item;
            debugger;
            showControlpanel();
            setControlValues();
        });

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

async function flipObject() {
    await viewerApi.rotateView([0, 360]);
}

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

    document.querySelector('#btnFlip').addEventListener('click', flipObject);

    run('3e6302de-21c3-4ffe-8bea-41f42403ba00');
}