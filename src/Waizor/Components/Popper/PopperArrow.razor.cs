using Microsoft.AspNetCore.Components;

namespace Waizor.Components;

public partial class PopperArrow : ComponentBase
{
    [CascadingParameter]
    public required Popper Popper { get; set; }

    [CascadingParameter]
    public required PopperContent PopperContent { get; set; }

    private ElementReference elementReference;

    protected override void OnAfterRender(bool firstRender)
    {
        if (!firstRender)
        {
            return;
        }

        Popper.SetArrow(elementReference);
    }
}
