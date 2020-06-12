import('https://www.vectary.com/viewer-api/v1/api.js').then(resp => {

    const { VctrApi } = resp;
    let ObjectList = [];

    run = async () => {

        errHandler = (err) => {
            console.log("API error", err);
        }

        onReady = async () => {
            console.log("API ready");
            try {

                const allSceneObjects = await viewerApi.getObjects();
                console.log("Objects", allSceneObjects);
                ObjectList = allSceneObjects.filter(obj => obj.type == "mesh");
                buildObjectList();

            } catch (e) {
                errHandler(e);
            }
        }

        const viewerApi = new VctrApi("a0521cdb-f85d-410e-8222-bac55f22475c", errHandler);

        try {
            await viewerApi.init();
            onReady();
        } catch (e) {
            errHandler(e);
        }
    };

    buildObjectList = () => {
        // const objectListDOM = document.querySelector('#object-list');

        // for (let index = 0; index < ObjectList.length; index++) {
        //     const element = ObjectList[index];

        //     var wrap = document.createElement("DIV"); 
        //     wrap.classList = 'custom-control custom-checkbox';
        //     wrap.innerHTML = `<input type="checkbox" class="custom-control-input" id="customCheck1_${index}">
        //                       <label class="custom-control-label" for="customCheck1_${index}">${element.name}</label>`;                  
        //     objectListDOM.appendChild(wrap);

        // }
    }

    run();

});

