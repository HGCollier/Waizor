﻿using Microsoft.AspNetCore.Components;
using Waizor.Primitives.Components.Internal;

namespace Waizor.Primitives.Components;

public class PopoverAnchor : PopperAnchor
{
    [CascadingParameter]
    public required Popover Popover { get; set; }

    protected override void OnAfterRender(bool firstRender)
    {
        if (!firstRender)
        {
            return;
        }

        base.OnAfterRender(firstRender);
        Popover.CustomAnchorAdd();
    }
}
