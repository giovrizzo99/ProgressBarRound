(function () {
    let template = document.createElement("template");
    template.innerHTML = `
    <style>
        :host {
            display: block;
            width: 100%;
            height: 30px;
            position: relative;
        }

        .progress-container {
            width: 100%;
            height: 100%;
            background-color: var(--empty-bar-color, #e0e0e0);
            border-radius: 5px;
            overflow: hidden;
            position: relative;
        }

        .progress-bar {
            height: 100%;
            width: 0%;
            background: linear-gradient(90deg, #05446b, #69a8e2);
            transition: width 0.5s ease-in-out;
        }

        .progress-indicator {
            position: absolute;
            top: 50%;
            transform: translate(-50%, -50%);
            width: 20px;
            height: 20px;
            border-radius: 50%;
            background-color: #ffffff; /* Dark blue inside */
            border: 3px solid #69a8e2; /* Light blue border */
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 12px;
            font-weight: bold;
            color: white;
            box-shadow: 0px 0px 5px rgba(0, 0, 0, 0.3);
        }
    </style>

    <div class="progress-container">
        <div class="progress-bar"></div>
        <div class="progress-indicator">0%</div>
    </div>
    `;

    class StraightProgressBar extends HTMLElement {
        constructor() {
            super();
            let shadowRoot = this.attachShadow({ mode: "open" });
            shadowRoot.appendChild(template.content.cloneNode(true));
            this._props = {};
        }

        async connectedCallback() {
            this.updateProgress();
        }

        async updateProgress() {
            const progressBar = this.shadowRoot.querySelector(".progress-bar");
            const progressIndicator = this.shadowRoot.querySelector(".progress-indicator");

            const percentage = this._props.percentage || 50;
            const emptyBarColor = this._props.emptyBarColor || "#e0e0e0";

            progressBar.style.width = `${percentage}%`;
            progressBar.style.background = "linear-gradient(90deg, #05446b, #69a8e2)";
            this.shadowRoot.querySelector(".progress-container").style.backgroundColor = emptyBarColor;
            
            progressIndicator.innerText = `${percentage}%`;
            progressIndicator.style.left = `calc(${percentage}% - 0px)`; /* Center aligns exactly */

        }

        onCustomWidgetBeforeUpdate(changedProperties) {
            this._props = { ...this._props, ...changedProperties };
        }

        onCustomWidgetAfterUpdate(changedProperties) {
            this.updateProgress();
        }
    }

    customElements.define("com-gr-progressbarround", StraightProgressBar);
})();
