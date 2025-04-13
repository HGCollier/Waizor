import {
    autoUpdate,
    computePosition,
    flip,
    offset,
    Placement,
    shift,
    arrow as floatingUIArrow,
    Middleware,
} from "@floating-ui/dom";
import { getSize } from "../utils/size";

const SIDE_OPTIONS = ["top", "right", "bottom", "left"] as const;
const ALIGN_OPTIONS = ["start", "center", "end"] as const;

type Side = (typeof SIDE_OPTIONS)[number];
type Align = (typeof ALIGN_OPTIONS)[number];

interface DotNetPopperObject {
    alignOffset: number;
    sideOffset: number;
    arrowPadding: number;
    content: HTMLElement;
    arrow: HTMLElement;
    anchor: HTMLElement;
    align: Align;
    side: Side;
}

interface Popper {
    cleanup: () => void;
}

const create = ({
    side,
    align,
    anchor,
    arrow,
    content,
    sideOffset,
    alignOffset,
    arrowPadding,
}: DotNetPopperObject): Popper => {
    const desiredPlacement = (side +
        (align !== "center" ? "-" + align : "")) as Placement;

    const cleanup = autoUpdate(anchor, content, () => {
        const arrowSize = getSize(arrow);
        const arrowWidth = arrowSize?.width ?? 0;
        const arrowHeight = arrowSize?.height ?? 0;

        computePosition(anchor, content, {
            strategy: "fixed",
            placement: desiredPlacement,
            middleware: [
                offset({
                    mainAxis: sideOffset + arrowHeight,
                    alignmentAxis: alignOffset,
                }),
                flip(),
                shift({ padding: 5 }),
                arrow &&
                    floatingUIArrow({ element: arrow, padding: arrowPadding }),
                transformOrigin({ arrowWidth, arrowHeight }),
            ],
        }).then(({ x, y, middlewareData }) => {
            Object.assign(content.style, {
                transform: `translate(${x}px, ${y}px)`,
            });

            if (arrow == null) {
                return;
            }

            const arrowX = middlewareData.arrow?.x;
            const arrowY = middlewareData.arrow?.y;

            Object.assign(arrow.style, {
                left: `${arrowX}px`,
                top: `${arrowY}px`,
            });
        });
    });

    return {
        cleanup,
    };
};

const dispose = (popper: Popper) => {
    popper.cleanup();
};

const transformOrigin = (options: {
    arrowWidth: number;
    arrowHeight: number;
}): Middleware => ({
    name: "transformOrigin",
    options,
    fn(data) {
        const { placement, rects, middlewareData } = data;

        const cannotCenterArrow = middlewareData.arrow?.centerOffset !== 0;
        const isArrowHidden = cannotCenterArrow;
        const arrowWidth = isArrowHidden ? 0 : options.arrowWidth;
        const arrowHeight = isArrowHidden ? 0 : options.arrowHeight;

        const [placedSide, placedAlign] =
            getSideAndAlignFromPlacement(placement);
        const noArrowAlign = { start: "0%", center: "50%", end: "100%" }[
            placedAlign
        ];

        const arrowXCenter = (middlewareData.arrow?.x ?? 0) + arrowWidth / 2;
        const arrowYCenter = (middlewareData.arrow?.y ?? 0) + arrowHeight / 2;

        let x = "";
        let y = "";

        if (placedSide === "bottom") {
            x = isArrowHidden ? noArrowAlign : `${arrowXCenter}px`;
            y = `${-arrowHeight}px`;
        } else if (placedSide === "top") {
            x = isArrowHidden ? noArrowAlign : `${arrowXCenter}px`;
            y = `${rects.floating.height + arrowHeight}px`;
        } else if (placedSide === "right") {
            x = `${-arrowHeight}px`;
            y = isArrowHidden ? noArrowAlign : `${arrowYCenter}px`;
        } else if (placedSide === "left") {
            x = `${rects.floating.width + arrowHeight}px`;
            y = isArrowHidden ? noArrowAlign : `${arrowYCenter}px`;
        }
        return { data: { x, y } };
    },
});

const getSideAndAlignFromPlacement = (placement: Placement) => {
    const [side, align = "center"] = placement.split("-");
    return [side as Side, align as Align] as const;
};

const popper = {
    create,
    dispose,
};

export { popper, type Popper };
