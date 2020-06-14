
var sliderPicker = new iro.ColorPicker(".colorPicker", {
    width: 250,
    color: "#d93bbf",
    padding: 0,
    handleRadius:5,
    borderWidth: 0,
    layout: [
        {
            component: iro.ui.Slider,
            options: {
                sliderType: 'hue'
            }
        },
        {
            component: iro.ui.Slider,
            options: {
                sliderType: 'saturation'
            }
        },
        {
            component: iro.ui.Slider,
            options: {
                sliderType: 'value'
            }
        },
        // {
        //     component: iro.ui.Slider,
        //     options: {
        //         sliderType: 'alpha'
        //     }
        // },
    ]
});

var controlColorPicker = new iro.ColorPicker(".controlColorPicker", {
    width: 250,
    color: "#d93bbf",
    padding: 0,
    handleRadius:5,
    borderWidth: 0,
    layout: [
        {
            component: iro.ui.Slider,
            options: {
                sliderType: 'hue'
            }
        },
        {
            component: iro.ui.Slider,
            options: {
                sliderType: 'saturation'
            }
        },
        {
            component: iro.ui.Slider,
            options: {
                sliderType: 'value'
            }
        },
        // {
        //     component: iro.ui.Slider,
        //     options: {
        //         sliderType: 'alpha'
        //     }
        // },
    ]
});


var body = document.querySelector("body");

sliderPicker.on(["color:init", "color:change"], color => {
    body.style.backgroundColor = color.hexString;
});

export default controlColorPicker;