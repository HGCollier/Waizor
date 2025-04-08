import { FocusableElement, tabbable } from "tabbable";
import { Orientation } from "../enums/orientation";

interface RovingFocus {
    selected: number;
    tabbableElements: FocusableElement[];
    focusedElement: FocusableElement;
    onKeyDown: (event: KeyboardEvent) => void;
    onFocus: (event: FocusEvent) => void;
}

const create = (
    element: HTMLElement,
    orientation: Orientation
): RovingFocus => {
    const tabbableElements = tabbable(element);

    let selected = 0;
    let focusedElement = tabbableElements[selected];

    const onKeyDown = (event: KeyboardEvent) => {
        if (!tabbableElements.some((x) => x === event.target)) {
            return;
        }

        const isVertical = orientation === Orientation.Vertical;
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
                selected =
                    selected === 0 ? tabbableElements.length - 1 : selected - 1;
            } else if (isNextKey) {
                selected =
                    selected === tabbableElements.length - 1 ? 0 : selected + 1;
            }

            changeFocus(selected);
        }
    };

    const onFocus = (event: FocusEvent) => {
        selected = tabbableElements.findIndex((x) => x === event.target);
    };

    const changeFocus = (index: number) => {
        focusedElement = tabbableElements[index];
        focusedElement.focus();
    };

    element.addEventListener("keydown", onKeyDown);
    tabbableElements.forEach((element: Element) => {
        if (!(element instanceof HTMLElement)) {
            return;
        }
        element.addEventListener("focus", onFocus);
    });

    return {
        selected,
        tabbableElements,
        focusedElement,
        onKeyDown,
        onFocus,
    };
};

const dispose = (element: HTMLElement, rovingFocus: RovingFocus) => {
    element.removeEventListener("keydown", rovingFocus.onKeyDown);
    rovingFocus.tabbableElements.forEach((element: Element) => {
        if (!(element instanceof HTMLElement)) {
            return;
        }
        element.removeEventListener("focus", rovingFocus.onFocus);
    });
};

const rovingFocus = {
    create,
    dispose,
};

export { rovingFocus };
