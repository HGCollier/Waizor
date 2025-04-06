﻿using Microsoft.AspNetCore.Components;

namespace Waizor.Components;

public partial class AlertDialogTitle : ComponentBase
{
    [Parameter]
    public required RenderFragment ChildContent { get; set; }

    [Parameter]
    public string? Class { get; set; }

    [CascadingParameter]
    public required AlertDialog AlertDialog { get; set; }
}
