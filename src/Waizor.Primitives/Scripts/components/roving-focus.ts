import { FocusableElement, tabbable, isTabbable } from "tabbable";
import { Orientation } from "../enums/orientation";

interface DotNetRovingFocusObject {
    containerElementReference: HTMLElement;
    orientation: Orientation;
    loop: boolean;
}

class RovingFocus {
    selected = 0;
    loop = true;
    orientation: Orientation = Orientation.Vertical;

    elements: HTMLElement[] = [];

    focusedElement: FocusableElement | null = null;
    focusableContainerElements: FocusableElement[] = [];

    get tabbableElements() {
        return this.focusableContainerElements.filter((element) => {
            if (!(element instanceof HTMLElement)) {
                return false;
            }

            return isTabbable(element) && this.elements.includes(element);
        });
    }

    constructor(dotNetRovingFocusObject: DotNetRovingFocusObject) {
        this.update(dotNetRovingFocusObject);
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
                if (!this.loop && this.selected === 0) {
                    this.changeFocus(this.selected);
                    return;
                }

                this.selected =
                    this.selected === 0
                        ? this.tabbableElements.length - 1
                        : this.selected - 1;
            } else if (isNextKey) {
                if (
                    !this.loop &&
                    this.selected === this.tabbableElements.length - 1
                ) {
                    this.changeFocus(this.selected);
                    return;
                }

                this.selected =
                    this.selected === this.tabbableElements.length - 1
                        ? 0
                        : this.selected + 1;
            }
            this.changeFocus(this.selected);
        }
    };

    update = ({
        containerElementReference,
        orientation,
        loop,
    }: DotNetRovingFocusObject) => {
        console.log(containerElementReference);

        if (containerElementReference != null) {
            this.focusableContainerElements = tabbable(
                containerElementReference
            );
        }

        this.orientation = orientation;
        this.loop = loop;
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

export { RovingFocus, DotNetRovingFocusObject };
