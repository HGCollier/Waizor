﻿using Microsoft.AspNetCore.Components;
using Waizor.Primitives.Abstractions;

namespace Waizor.Primitives.Components;

public partial class DialogTrigger : SlotBase
{
    [Parameter]
    public string Id { get; set; } = Guid.NewGuid().ToString();

    [Parameter]
    public string? Class { get; set; }

    [CascadingParameter]
    public required IDialog Dialog { get; set; }

    protected override Dictionary<string, object> Attributes
    {
        get
        {
            Dictionary<string, object> attributes =
                new() { { "id", Id }, { "onclick", () => OnClick() } };

            if (Class != null)
            {
                attributes.Add("class", Class);
            }

            return attributes;
        }
    }

    private void OnClick() => Dialog.Show();
}
