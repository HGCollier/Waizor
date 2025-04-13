using Microsoft.AspNetCore.Components;
using Waizor.Constants;
using Waizor.Enums;

namespace Waizor.Components;

public partial class PopperArrow : ComponentBase
{
    [CascadingParameter]
    public required Popper Popper { get; set; }

    [CascadingParameter]
    public required PopperContent PopperContent { get; set; }

    private ElementReference elementReference;

    private string BaseSide =>
        Positioning.OppositeSide[PopperContent.Side].ToString().ToLowerInvariant();

    private string Transform =>
        new Dictionary<Side, string>()
        {
            { Side.Top, "translateY(100%)" },
            { Side.Right, "translateY(50%) rotate(90deg) translateX(-50%)" },
            { Side.Bottom, "rotate(180deg)" },
            { Side.Left, "translateY(50%) rotate(-90deg) translateX(50%)" },
        }[PopperContent.Side]
            .ToString()
            .ToLowerInvariant();

    private string TransformOrigin =>
        new Dictionary<Side, string>()
        {
            { Side.Top, "" },
            { Side.Right, "0 0" },
            { Side.Bottom, "center 0" },
            { Side.Left, "100% 0" },
        }[PopperContent.Side]
            .ToString()
            .ToLowerInvariant();

    protected override void OnAfterRender(bool firstRender)
    {
        if (!firstRender)
        {
            return;
        }

        Popper.SetArrow(elementReference);
    }
}
