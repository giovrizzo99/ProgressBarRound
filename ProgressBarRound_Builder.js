(function () {
    let template = document.createElement("template");
    template.innerHTML = `
    <style>
        :host {
            display: block;
            width: 100%;
            height: 100%;
            position: relative;
        }

        .progress-container {
            width: 100%;
            height: 100%;
            background-color: var(--empty-bar-color, #f0f0f0);
            border-radius: 5px;
            overflow: hidden;
            position: relative;
        }

        .progress-bar {
            height: 100%;
            width: 0%;
            background: linear-gradient(90deg, var(--start-color, #05446b), var(--end-color, #69a8e2));
            transition: width 0.5s ease-in-out;
        }

        .progress-indicator {
            position: absolute;
            top: 50%;
            transform: translate(-50%, -50%);
            width: auto;
            height: 90%;
            aspect-ratio: 1 / 1;
            border-radius: 50%;
            background-color: var(--bar-color, #05446b);
            border: 3px solid var(--end-color, #69a8e2);
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 10px;
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
            const progressContainer = this.shadowRoot.querySelector(".progress-container");

            const percentage = this._props.percentage || 0;
            const barColor = this._props.barColor || "#05446b";
            const startColor = this._props.startColor || "#05446b";
            const endColor = this._props.endColor || "#69a8e2";
            const emptyBarColor = this._props.emptyBarColor || "#f0f0f0";

            var h = progressContainer.getBoundingClientRect().height;
            var w = progressContainer.getBoundingClientRect().width;
            var half_ratio_h_w = (h > 6) * 50 * (h - 6) / w;
            var ratio_border_height = 100 * (h >= 6) * 6 / h;
            var half_ratio_border_width = 100 * (w >= 6) * 3 / w;
            var new_height = Math.floor(100 - ratio_border_height);
            progressIndicator.style.height = `${new_height}%`;

            var adjperc = percentage;
            if (percentage < half_ratio_border_width + half_ratio_h_w) {
                adjperc = Math.ceil(half_ratio_border_width + half_ratio_h_w);
            }
            if (percentage > 100 - half_ratio_border_width - half_ratio_h_w) {
                adjperc = Math.floor(100 - half_ratio_border_width - half_ratio_h_w);
            }
            console.log(adjperc, half_ratio_border_width, half_ratio_h_w, percentage, h, progressIndicator.style.height);

            progressBar.style.width = `${percentage}%`;
            progressBar.style.background = `linear-gradient(90deg, ${startColor}, ${endColor})`;
            this.shadowRoot.querySelector(".progress-container").style.backgroundColor = emptyBarColor;
            progressIndicator.innerText = `${percentage}%`;
            progressIndicator.style.left = `${adjperc}%`;
            progressIndicator.style.backgroundColor = startColor;
            progressIndicator.style.borderColor = endColor;
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
