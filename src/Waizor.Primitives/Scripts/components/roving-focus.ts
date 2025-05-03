import { FocusableElement, tabbable, isTabbable } from "tabbable";
import { Orientation } from "../enums/orientation";

class RovingFocus {
    selected = 0;
    orientation: Orientation;

    elements: HTMLElement[] = [];

    focusedElement: FocusableElement | null = null;

    get tabbableElements() {
        return this.elements.filter((x) => isTabbable(x));
    }

    constructor(orientation: Orientation) {
        this.orientation = orientation;
    }

    onKeyDown = (event: KeyboardEvent) => {
        if (
            !this.tabbableElements.some(
                (tabbableElement) => tabbableElement === event.target
            )
        ) {
            return;
        }

        const isVertical = this.orientation === Orientation.Vertical;
        const isPrevKey = event.key === "ArrowUp" || event.key === "ArrowLeft";
        const isNextKey =
            event.key === "ArrowDown" || event.key === "ArrowRight";
        const isValidKey =
            (isVertical &&
                (event.key === "ArrowUp" || event.key === "ArrowDown")) ||
            (!isVertical &&
                (event.key === "ArrowLeft" || event.key === "ArrowRight"));
        if (isValidKey) {
            event.preventDefault();
            if (isPrevKey) {
                this.selected =
                    this.selected === 0
                        ? this.tabbableElements.length - 1
                        : this.selected - 1;
            } else if (isNextKey) {
                this.selected =
                    this.selected === this.tabbableElements.length - 1
                        ? 0
                        : this.selected + 1;
            }
            this.changeFocus(this.selected);
        }
    };

    update = (orientation: Orientation) => {
        this.orientation = orientation;
    };

    onFocus = (event: FocusEvent) => {
        this.selected = this.tabbableElements.findIndex(
            (tabbableElement) => tabbableElement === event.target
        );
    };

    changeFocus = (index: number) => {
        this.focusedElement = this.tabbableElements[index];
        this.focusedElement.focus();
    };

    addItem = (element: HTMLElement | null) => {
        if (element == null) {
            return;
        }

        if (this.elements.includes(element)) {
            return;
        }

        element.addEventListener("focus", this.onFocus);
        element.addEventListener("keydown", this.onKeyDown);
        this.elements.push(element);
    };

    removeItem = (element: HTMLElement | null) => {
        if (element == null) {
            return;
        }

        element.removeEventListener("keydown", this.onKeyDown);
        element.removeEventListener("focus", this.onFocus);

        const index = this.elements.indexOf(element);
        if (index > -1) {
            this.elements.splice(index, 1);
        }
    };

    dispose = () => {
        this.elements.forEach((element) => {
            element.removeEventListener("keydown", this.onKeyDown);
            element.removeEventListener("focus", this.onFocus);
        });
    };
}

export { RovingFocus };
