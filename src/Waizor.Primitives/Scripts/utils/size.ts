type Size = { width: number; height: number } | undefined;

const getSize = (element: HTMLElement | null): Size => {
    let size: Size = undefined;

    if (element) {
        const width = element.offsetWidth;
        const height = element.offsetHeight;
        size = { width, height };
    }

    return size;
};

export { getSize };
