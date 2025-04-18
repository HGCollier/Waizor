﻿using Microsoft.AspNetCore.Components;

namespace Waizor.Components;

public partial class AlertDialogPortal : ComponentBase
{
    [Parameter]
    public required RenderFragment ChildContent { get; set; }

    [CascadingParameter]
    public required AlertDialog AlertDialog { get; set; }
}
