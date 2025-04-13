import {
    autoUpdate,
    computePosition,
    flip,
    offset,
    Placement,
    shift,
} from "@floating-ui/dom";

interface Popover {
    cleanup: () => void;
}

const create = (
    trigger: HTMLElement,
    content: HTMLElement,
    placement: Placement
): Popover => {
    const cleanup = autoUpdate(trigger, content, () => {
        computePosition(trigger, content, {
            strategy: "fixed",
            placement: placement,
            middleware: [offset(6), flip(), shift({ padding: 5 })],
        }).then(({ x, y }) => {
            Object.assign(content.style, {
                transform: `translate(${x}px, ${y}px)`,
            });
        });
    });

    return {
        cleanup,
    };
};

const dispose = (popover: Popover) => {
    popover.cleanup();
};

const popover = {
    create,
    dispose,
};

export { popover, type Popover };
