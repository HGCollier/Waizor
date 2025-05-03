import { DotNet } from "../lib/dotnet";

enum AvatarStatus {
    Loading,
    Loaded,
    Error,
}

const avatar = (src: string, dotNetObject: DotNet.DotNetObject) => {
    const img = new window.Image();
    img.src = src;

    const onStateChange = async (status: AvatarStatus) => {
        await dotNetObject.invokeMethodAsync("UpdateStatus", status);
    };

    img.addEventListener(
        "load",
        async () => await onStateChange(AvatarStatus.Loaded)
    );
    img.addEventListener(
        "error",
        async () => await onStateChange(AvatarStatus.Error)
    );
};

export { avatar };
