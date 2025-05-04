using Microsoft.AspNetCore.Components;

namespace Waizor.Primitives.Components.Internal;

public partial class MenuAnchor : PopperAnchor
{
    [CascadingParameter]
    public required Menu Menu { get; set; }

    protected override void OnAfterRender(bool firstRender)
    {
        base.OnAfterRender(firstRender);

        if (!firstRender)
        {
            return;
        }

        Menu.CustomAnchorAdd();
    }
}
