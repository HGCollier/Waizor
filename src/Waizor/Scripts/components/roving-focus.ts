import { FocusableElement, tabbable, isTabbable } from "tabbable";
import { Orientation } from "../enums/orientation";

interface RovingFocus {
    element: HTMLElement;
    selected: number;
    originalElements: FocusableElement[];
    tabbableElements: FocusableElement[];
    focusedElement: FocusableElement;
    onKeyDown: (event: KeyboardEvent) => void;
    onFocus: (event: FocusEvent) => void;
    orientation: Orientation;
}

const create = (
    element: HTMLElement,
    orientation: Orientation
): RovingFocus => {
    const tabbableElements = tabbable(element);

    return initialize(element, orientation, tabbableElements);
};

const initialize = (
    element: HTMLElement,
    orientation: Orientation,
    tabbableElements: FocusableElement[],
    originalElements?: FocusableElement[]
): RovingFocus => {
    let selected = 0;

    const focusedIndex = tabbableElements.findIndex(
        (x) => document.activeElement === x
    );
    if (focusedIndex > -1) {
        selected = focusedIndex;
        tabbableElements[focusedIndex].focus();
    }

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
        element,
        selected,
        tabbableElements,
        originalElements: originalElements ?? tabbableElements,
        focusedElement,
        onKeyDown,
        onFocus,
        orientation,
    };
};

const update = (rovingFocus: RovingFocus): RovingFocus => {
    dispose(rovingFocus);

    return initialize(
        rovingFocus.element,
        rovingFocus.orientation,
        rovingFocus.originalElements.filter((x) => isTabbable(x)),
        rovingFocus.originalElements
    );
};

const dispose = (rovingFocus: RovingFocus) => {
    rovingFocus.element.removeEventListener("keydown", rovingFocus.onKeyDown);
    rovingFocus.tabbableElements.forEach((element: Element) => {
        if (!(element instanceof HTMLElement)) {
            return;
        }
        element.removeEventListener("focus", rovingFocus.onFocus);
    });
};

const rovingFocus = {
    create,
    update,
    dispose,
};

export { rovingFocus };
