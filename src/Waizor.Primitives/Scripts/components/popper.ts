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
const OPPOSITE_SIDE: Record<Side, Side> = {
    top: "bottom",
    right: "left",
    bottom: "top",
    left: "right",
};

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

class Popper {
    alignOffset = 0;
    align: Align = "center";

    sideOffset = 0;
    side: Side = "bottom";

    content: HTMLElement;
    anchor: HTMLElement;

    arrowPadding = 0;
    arrow: HTMLElement | null = null;

    cleanup: () => void;

    constructor(dotNetPopperObject: DotNetPopperObject) {
        this.content = dotNetPopperObject.content;
        this.anchor = dotNetPopperObject.anchor;

        this.update(dotNetPopperObject);

        this.cleanup = autoUpdate(
            this.anchor,
            this.content,
            this.computePosition
        );
    }

    computePosition = () => {
        const arrowSize = getSize(this.arrow);
        const arrowWidth = arrowSize?.width ?? 0;
        const arrowHeight = arrowSize?.height ?? 0;

        const desiredPlacement = (this.side +
            (this.align !== "center" ? "-" + this.align : "")) as Placement;

        computePosition(this.anchor, this.content, {
            strategy: "fixed",
            placement: desiredPlacement,
            middleware: [
                offset({
                    mainAxis: this.sideOffset + arrowHeight,
                    alignmentAxis: this.alignOffset,
                }),
                flip(),
                shift({ padding: 5 }),
                this.arrow &&
                    floatingUIArrow({
                        element: this.arrow,
                        padding: this.arrowPadding,
                    }),
                transformOrigin({ arrowWidth, arrowHeight }),
            ],
        }).then(({ x, y, middlewareData, placement }) => {
            Object.assign(this.content.style, {
                transform: `translate(${x}px, ${y}px)`,
            });

            if (this.arrow == null || middlewareData.arrow == null) {
                return;
            }

            const { x: arrowX, y: arrowY } = middlewareData.arrow;

            const [side] = getSideAndAlignFromPlacement(placement);

            const oppositeSide = OPPOSITE_SIDE[side];

            Object.assign(this.arrow.style, {
                left: arrowX != null ? `${arrowX}px` : "",
                top: arrowY != null ? `${arrowY}px` : "",
                bottom: "",
                right: "",
                [oppositeSide]: 0,
                transform: {
                    top: "translateY(100%)",
                    right: "translateY(50%) rotate(90deg) translateX(-50%)",
                    bottom: `rotate(180deg)`,
                    left: "translateY(50%) rotate(-90deg) translateX(50%)",
                }[side],
                transformOrigin: {
                    top: "",
                    right: "0 0",
                    bottom: "center 0",
                    left: "100% 0",
                }[side],
            });
        });
    };

    update = ({
        alignOffset,
        align,
        sideOffset,
        side,
        arrow,
        arrowPadding,
        anchor,
    }: DotNetPopperObject) => {
        this.alignOffset = alignOffset;
        this.align = align;

        this.sideOffset = sideOffset;
        this.side = side;

        this.anchor = anchor;

        this.arrow = arrow;
        this.arrowPadding = arrowPadding;

        this.computePosition();
    };
}

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

export { Popper, type DotNetPopperObject };
