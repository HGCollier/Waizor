using Waizor.Enums;

namespace Waizor.Constants;

internal static class Positioning
{
    public static readonly Dictionary<Side, Side> OppositeSide =
        new()
        {
            { Side.Top, Side.Bottom },
            { Side.Right, Side.Left },
            { Side.Bottom, Side.Top },
            { Side.Left, Side.Right }
        };
}
