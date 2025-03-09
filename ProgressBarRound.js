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
            background: linear-gradient(90deg, #ff512f, #dd2476);
            transition: width 0.5s ease-in-out;
        }

        .progress-indicator {
            position: absolute;
            top: 50%;
            transform: translate(-50%, -50%);
            width: 30px;
            height: 30px;
            border-radius: 50%;
            background-color: white;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 12px;
            font-weight: bold;
            color: black;
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
            const gradient = this._props.barGradient || "linear-gradient(90deg, #ff512f, #dd2476)";
            const emptyBarColor = this._props.emptyBarColor || "#e0e0e0";

            progressBar.style.width = `${percentage}%`;
            progressBar.style.background = gradient;
            this.shadowRoot.querySelector(".progress-container").style.backgroundColor = emptyBarColor;
            
            progressIndicator.innerText = `${percentage}%`;
            progressIndicator.style.left = `calc(${percentage}% - 15px)`; // Centering the indicator

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
